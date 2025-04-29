import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export const comparePassword = (
  plainTextPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compareSync(plainTextPassword, hashedPassword)
}
