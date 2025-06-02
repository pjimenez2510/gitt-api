import { person } from 'drizzle/schema/tables/users/person'
import { user } from 'drizzle/schema/tables/users/user'
import { hashPassword } from 'src/common/utils/encrypter'
import { PERSON_STATUS } from 'src/core/people/types/person-status.enum'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { USER_TYPE } from 'src/core/users/types/user-type.enum'

export const peopleSeed: (typeof person.$inferInsert)[] = [
  {
    dni: '0707047643',
    firstName: 'Daniel',
    lastName: 'Zhu',
    email: 'ezhu7643@uta.edu.ec',
    birthDate: new Date('2003-09-24').toISOString(),
    status: PERSON_STATUS.ACTIVE,
    secondLastName: 'Garcia',
    middleName: 'Andres',
    phone: '0982828282',
  },
  {
    dni: '1712456789',
    firstName: 'María',
    lastName: 'González',
    email: 'mgonzalez@gmail.com',
    birthDate: new Date('1992-05-15').toISOString(),
    status: PERSON_STATUS.ACTIVE,
    secondLastName: 'Rodríguez',
    middleName: 'Fernanda',
    phone: '0998765432',
  },
  {
    dni: '0103784526',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    email: 'cmendoza@hotmail.com',
    birthDate: new Date('1988-11-30').toISOString(),
    status: PERSON_STATUS.INACTIVE,
    secondLastName: 'Suárez',
    middleName: 'Patricio',
    phone: '0987654321',
  },
  {
    dni: '0603214578',
    firstName: 'Ana',
    lastName: 'Morales',
    email: 'amorales@outlook.com',
    birthDate: new Date('1995-07-12').toISOString(),
    status: PERSON_STATUS.DEFAULTER,
    secondLastName: 'Castillo',
    middleName: 'Lucía',
    phone: '0976543210',
  },
  {
    dni: '1804567823',
    firstName: 'Roberto',
    lastName: 'Valencia',
    email: 'rvalencia@yahoo.com',
    birthDate: new Date('1985-03-22').toISOString(),
    status: PERSON_STATUS.SUSPENDED,
    secondLastName: 'Torres',
    middleName: 'Alejandro',
    phone: '0965432109',
  },
]

export const usersSeed: (typeof user.$inferInsert)[] = [
  {
    personId: 1,
    userName: 'ezhu7643',
    passwordHash: hashPassword('123456'),
    userType: USER_TYPE.ADMINISTRATOR,
    status: USER_STATUS.ACTIVE,
  },
]
