import { HttpStatus, Injectable } from '@nestjs/common'
import { SignInDto } from './dto/req/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types/jwt-payload.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { comparePassword } from 'src/common/utils/encrypter'
import { DatabaseService } from 'src/global/database/database.service'
import { person, user } from 'drizzle/schema'
import { eq } from 'drizzle-orm'
import { UserRole } from './types/user-role'

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

    this.verifyPassword(password, userFound.passwordHash)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: pass, ...userWithoutPassword } = userFound

    return {
      token: this.createToken({
        id: userFound.id,
        role: userFound.userType as UserRole,
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

  private createToken = (payload: JwtPayload) => {
    return this.jwtService.sign(payload)
  }

  verifyToken = (token: string) => {
    try {
      return this.jwtService.verify(token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new DisplayableException('Token inválido', HttpStatus.UNAUTHORIZED)
    }
  }
}
