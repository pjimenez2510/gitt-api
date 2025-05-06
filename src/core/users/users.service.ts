import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  // constructor(private dbService: DatabaseService) {}
  // private usersWithoutPassword = excludeColumns(user, 'passwordHash')
  // async findAll({ limit, page }: BaseParamsDto) {
  //   const offset = (page - 1) * limit
  //   const query = this.dbService.db
  //     .select(this.usersWithoutPassword)
  //     .from(user)
  //     .orderBy(desc(user.id))
  //     .limit(limit)
  //     .offset(offset)
  //   const totalQuery = this.dbService.db.select({ count: count() }).from(user)
  //   const [records, totalResult] = await Promise.all([
  //     query.execute(),
  //     totalQuery.execute(),
  //   ])
  //   const total = totalResult[0].count
  //   return {
  //     records,
  //     total,
  //     limit,
  //     page,
  //     pages: Math.ceil(total / limit),
  //   }
  // }
  // async create(dto: CreateUserDto) {
  //   // Check if person is already associated
  //   const [alreadyExistPersonAssociated] = await this.dbService.db
  //     .select(this.usersWithoutPassword)
  //     .from(user)
  //     .where(eq(sql<string>`lower(${user.email})`, dto.userName.toLowerCase()))
  //     .limit(1)
  //     .execute()
  //   if (alreadyExistPersonAssociated) {
  //     throw new DisplayableException(
  //       'Ya existe una persona asociada a este usuario',
  //       HttpStatus.CONFLICT,
  //     )
  //   }
  //   const hashedPassword = hashPassword(dto.password)
  //   const [newUser] = await this.dbService.db
  //     .insert(user)
  //     .values({
  //       userName: dto.userName,
  //       password: hashedPassword,
  //     })
  //     .returning(this.usersWithoutPassword)
  //     .execute()
  //   return newUser
  // }
  // async update(id: number, dto: UpdateUserDto) {
  //   await this.findOne(id) // Verify user exists
  //   const updateData: Partial<UpdateUserDto> = { ...dto }
  //   if (dto.password) {
  //     updateData.password = hashPassword(dto.password)
  //   }
  //   const [updatedUser] = await this.dbService.db
  //     .update(user)
  //     .set(updateData)
  //     .where(eq(user.id, id))
  //     .returning(this.usersWithoutPassword)
  //     .execute()
  //   return updatedUser
  // }
  // async findOne(id: number) {
  //   const [user] = await this.dbService.db
  //     .select(this.usersWithoutPassword)
  //     .from(user)
  //     .where(eq(user.id, id))
  //     .limit(1)
  //     .execute()
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`)
  //   }
  //   return user
  // }
  // async remove(id: number) {
  //   await this.findOne(id) // Verify user exists
  //   const [deletedUser] = await this.dbService.db
  //     .delete(user)
  //     .where(eq(user.id, id))
  //     .returning(this.usersWithoutPassword)
  //     .execute()
  //   if (!deletedUser) {
  //     throw new DisplayableException(
  //       `Error deleting user with id ${id}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     )
  //   }
  //   return deletedUser
  // }
}
