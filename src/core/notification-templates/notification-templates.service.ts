import { Injectable } from '@nestjs/common';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';

@Injectable()
export class NotificationTemplatesService {
  create(createNotificationTemplateDto: CreateNotificationTemplateDto) {
    return 'This action adds a new notificationTemplate';
  }

  findAll() {
    return `This action returns all notificationTemplates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificationTemplate`;
  }

  update(id: number, updateNotificationTemplateDto: UpdateNotificationTemplateDto) {
    return `This action updates a #${id} notificationTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificationTemplate`;
  }
}
