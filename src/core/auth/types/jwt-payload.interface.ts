import { UserRole } from './user-role'

export class JwtPayload {
  id: string
  role: UserRole
}
