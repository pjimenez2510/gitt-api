import { PartialType } from '@nestjs/swagger'
import { CreateItemColorDto } from './create-item-color.dto'

export class UpdateItemColorDto extends PartialType(CreateItemColorDto) {}
