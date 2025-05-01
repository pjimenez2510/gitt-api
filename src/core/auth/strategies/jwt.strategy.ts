import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../types/jwt-payload.interface'
import { Request } from 'express'
import { CustomConfigService } from 'src/global/config/config.service'
import { DatabaseService } from 'src/global/database/database.service'
import { user } from 'drizzle/schema'
import { eq } from 'drizzle-orm'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: CustomConfigService,
  ) {
    super({
      secretOrKey: configService.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  authenticate(req: Request, options?: unknown): void {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Token not found')
    }

    super.authenticate(req, options)
  }

  async validate(payload: JwtPayload): Promise<typeof user.$inferSelect> {
    const { id } = payload
    const [userFound] = await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    if (!userFound) throw new UnauthorizedException('Token not valid')

    if (userFound.status !== 'ACTIVE')
      throw new UnauthorizedException('User is inactive, talk with an admin')

    return userFound
  }
}
