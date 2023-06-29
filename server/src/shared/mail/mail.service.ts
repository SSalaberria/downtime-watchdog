import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { UserRegisteredEvent } from 'src/auth/events';

import type { User } from '../user';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  @OnEvent(UserRegisteredEvent.name)
  async sendConfirmationEmail({ user, token }: UserRegisteredEvent): Promise<void> {
    const { name, email } = user;

    const confirmationUrl = `${this.configService.get('emailConfirmationUrl')}?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Downtime watchdog - Confirm your email',
      template: './confirmation',
      context: {
        name,
        confirmationUrl,
      },
    });
  }

  async notifyDowntime(user: User, websiteUrl: string): Promise<void> {
    const { name, email } = user;

    await this.sendMailToUser(user, {
      to: email,
      subject: 'Downtime watchdog - One of your tracked websites is down!',
      template: './down-notification',
      context: {
        name,
        websiteUrl,
      },
    });
  }

  async sendMailToUser(user: User, payload: ISendMailOptions): Promise<void> {
    if (user.verified) {
      await this.mailerService.sendMail(payload);
    }
  }
}
