import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../types/user-role'

export const META_ROLES = 'roles'

export const RoleProtected = (...args: UserRole[]) => {
  return SetMetadata(META_ROLES, args)
}
