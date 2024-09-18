import { MailService } from 'src/mail/mail.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.username);

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const samePasswords = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!samePasswords) {
      throw new UnauthorizedException('Wrong credentials');
    } else if (!user.accountConfirmed) {
      await this.mailService.sendUserConfirmation(user);
      throw new UnauthorizedException("Account isn't confirmed");
    }

    const payload = { sub: user.id, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
