import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findAll(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async countUnread(userId: string) {
    return this.notificationRepository.count({
      where: { userId, readAt: IsNull() },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  async createNotification(userId: string, message: string, type: string) {
    const notification = this.notificationRepository.create({
      userId,
      message,
      type,
    });
    return this.notificationRepository.save(notification);
  }
}
