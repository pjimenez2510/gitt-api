import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/**
 * Hashea una contraseña utilizando bcrypt
 * @param password Contraseña en texto plano
 * @returns Contraseña hasheada
 */
export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}
