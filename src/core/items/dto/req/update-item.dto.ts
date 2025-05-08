import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { CreateItemDto } from './create-item.dto'

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsOptional()
  updateDate?: Date = new Date()
}
