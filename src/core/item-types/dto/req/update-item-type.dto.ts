import { PartialType } from '@nestjs/swagger'
import { CreateItemTypeDto } from './create-item-type.dto'

export class UpdateItemTypeDto extends PartialType(CreateItemTypeDto) {}
