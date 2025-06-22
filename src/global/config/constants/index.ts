import * as Joi from 'joi'
import { IConfig } from '../types'

export const config = (): { APP: IConfig } => ({
  APP: {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    SQLSERVER_SERVER: process.env.SQLSERVER_SERVER ?? '',
    SQLSERVER_DATABASE: process.env.SQLSERVER_DATABASE ?? '',
    SQLSERVER_USER: process.env.SQLSERVER_USER ?? '',
    SQLSERVER_PASSWORD: process.env.SQLSERVER_PASSWORD ?? '',
    SQLSERVER_PORT: process.env.SQLSERVER_PORT
      ? parseInt(process.env.SQLSERVER_PORT, 10)
      : 1433,
    MAIL_HOST: process.env.MAIL_HOST ?? '',
    MAIL_PORT: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    MAIL_USER: process.env.MAIL_USER ?? '',
    MAIL_PASS: process.env.MAIL_PASS ?? '',
  },
})

export const configValidationSchema = Joi.object<IConfig>({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SQLSERVER_SERVER: Joi.string().optional().allow(''),
  SQLSERVER_DATABASE: Joi.string().optional().allow(''),
  SQLSERVER_USER: Joi.string().optional().allow(''),
  SQLSERVER_PASSWORD: Joi.string().optional().allow(''),
  SQLSERVER_PORT: Joi.number().default(1433),
  MAIL_HOST: Joi.string().optional().allow(''),
  MAIL_PORT: Joi.number().default(587),
  MAIL_USER: Joi.string().optional().allow(''),
  MAIL_PASS: Joi.string().optional().allow(''),
})
