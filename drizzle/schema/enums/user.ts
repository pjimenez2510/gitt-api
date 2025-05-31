import { pgEnum } from 'drizzle-orm/pg-core'
import { PERSON_STATUS } from 'src/core/people/types/person-status.enum'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

export const userType = pgEnum('user_type', USER_TYPE)

export const userStatus = pgEnum('user_status', USER_STATUS)

export const personStatus = pgEnum('person_status', PERSON_STATUS)
