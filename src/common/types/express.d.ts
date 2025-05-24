import { User } from '../../core/users/entities/user.entity'

declare global {
  namespace Express {
    interface Request {
      action?: string
      logMessage?: string
      user?: User
    }
  }
}

export {}
