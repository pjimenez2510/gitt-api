import { pgEnum } from 'drizzle-orm/pg-core'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

export const userType = pgEnum('user_type', USER_TYPE)

export const userStatus = pgEnum('user_status', USER_STATUS)
