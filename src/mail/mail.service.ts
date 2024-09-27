import { User } from './../user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = `http://localhost:3000/user/confirmation/${user.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bem-vindo ao Training Day! Confirme o seu e-mail.',
      template: 'confirmation',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
