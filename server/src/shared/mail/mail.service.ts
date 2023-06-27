import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import type { User } from '../user';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async notifyDowntime(user: User, websiteUrl: string): Promise<void> {
    const { name, email } = user;

    await this.mailerService.sendMail({
      to: email,
      from: '"Downtime watchdog" <downtimetracker.noreply@gmail.com>',
      subject: 'One of your tracked websites is down!',
      template: './down-notification',
      context: {
        name,
        websiteUrl,
      },
    });
  }
}
