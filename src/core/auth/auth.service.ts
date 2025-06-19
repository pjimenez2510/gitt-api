import { HttpStatus, Injectable } from '@nestjs/common'
import { SignInDto } from './dto/req/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types/jwt-payload.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { comparePassword } from 'src/common/utils/encrypter'
import { DatabaseService } from 'src/global/database/database.service'
import { person } from 'drizzle/schema/tables/users/person'
import { user } from 'drizzle/schema/tables/users/user'
import { eq } from 'drizzle-orm'
import { USER_STATUS } from '../users/types/user-status.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: SignInDto) {
    const [personFound] = await this.dbService.db
      .select()
      .from(person)
      .where(eq(person.email, email))
      .limit(1)

    if (!personFound)
      throw new DisplayableException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND,
      )

    const [userFound] = await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.personId, personFound.id))
      .limit(1)

    if (!userFound)
      throw new DisplayableException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND,
      )

    if (
      userFound.status !== USER_STATUS.ACTIVE &&
      userFound.status !== USER_STATUS.DEFAULTER
    )
      throw new DisplayableException(
        `Usuario no activo, estado: ${userFound.status}`,
        HttpStatus.BAD_REQUEST,
      )

    this.verifyPassword(password, userFound.passwordHash)

    const userWithoutPassword = {
      id: userFound.id,
      userName: userFound.userName,
      userType: userFound.userType,
      status: userFound.status,
      career: userFound.career,
      personId: userFound.personId,
    }

    return {
      token: this.createToken({
        id: userFound.id,
        role: userFound.userType,
      }),
      user: userWithoutPassword,
    }
  }

  private verifyPassword(password: string, userPassword: string) {
    const isPasswordValid = comparePassword(password, userPassword)

    if (!isPasswordValid)
      throw new DisplayableException(
        'Creedenciales incorrectas',
        HttpStatus.BAD_REQUEST,
      )

    return isPasswordValid
  }

  private readonly createToken = (payload: JwtPayload) => {
    return this.jwtService.sign(payload)
  }

  verifyToken = (token: string) => {
    try {
      return this.jwtService.verify(token)
    } catch {
      throw new DisplayableException('Token inválido', HttpStatus.UNAUTHORIZED)
    }
  }
}
