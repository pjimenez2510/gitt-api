import { UserRole } from './user-role'

export class JwtPayload {
  id: number
  role: UserRole
}
