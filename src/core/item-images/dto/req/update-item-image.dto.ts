import { PartialType } from '@nestjs/swagger'
import { CreateItemImageDto } from './create-item-image.dto'

export class UpdateItemImageDto extends PartialType(CreateItemImageDto) {}
