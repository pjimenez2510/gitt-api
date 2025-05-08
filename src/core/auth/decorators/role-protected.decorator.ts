import { SetMetadata } from '@nestjs/common'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

export const META_ROLES = 'roles'

export const RoleProtected = (...args: USER_TYPE[]) => {
  return SetMetadata(META_ROLES, args)
}
