import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleProtected } from './role-protected.decorator'
import { UserRole } from '../types/user-role'
import { AuthGuard } from '@nestjs/passport'

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), JwtAuthGuard),
  )
}
