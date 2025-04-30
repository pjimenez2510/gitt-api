import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'
import { DatabaseService } from 'src/global/database/database.service'
import { count, desc, eq, sql } from 'drizzle-orm'
import { users } from 'drizzle/schema'

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  async findAll({ limit, page }: BaseParamsDto) {
    const offset = (page - 1) * limit

    const query = this.dbService.db
      .select()
      .from(users)
      .orderBy(desc(users.id))
      .limit(limit)
      .offset(offset)

    const totalQuery = this.dbService.db.select({ count: count() }).from(users)

    const [records, totalResult] = await Promise.all([
      query.execute(),
      totalQuery.execute(),
    ])

    const total = totalResult[0].count

    return {
      records,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async create(dto: CreateUserDto) {
    // Check if person is already associated
    const [alreadyExistPersonAssociated] = await this.dbService.db
      .select()
      .from(users)
      .where(
        eq(sql<string>`lower(${users.userName})`, dto.userName.toLowerCase()),
      )
      .limit(1)
      .execute()

    if (alreadyExistPersonAssociated) {
      throw new DisplayableException(
        'Ya existe una persona asociada a este usuario',
        HttpStatus.CONFLICT,
      )
    }

    const hashedPassword = hashPassword(dto.password)

    const [newUser] = await this.dbService.db
      .insert(users)
      .values({
        userName: dto.userName,
        password: hashedPassword,
      })
      .returning()
      .execute()

    return newUser
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id) // Verify user exists

    const updateData: Partial<UpdateUserDto> = { ...dto }
    if (dto.password) {
      updateData.password = hashPassword(dto.password)
    }

    const [updatedUser] = await this.dbService.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()
      .execute()

    return updatedUser
  }

  async findOne(id: number) {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .execute()

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return user
  }

  async remove(id: number) {
    await this.findOne(id) // Verify user exists

    const [deletedUser] = await this.dbService.db
      .delete(users)
      .where(eq(users.id, id))
      .returning()
      .execute()

    if (!deletedUser) {
      throw new DisplayableException(
        `Error deleting user with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    return deletedUser
  }
}
