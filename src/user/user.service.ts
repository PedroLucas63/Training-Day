import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { confirmPassword, ...user } = createUserDto;

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    const createdUser: User = await this.prisma.user.create({ data: user });

    await this.mailService.sendUserConfirmation(createdUser);

    return createdUser;
  }

  async findAll() {
    /// TODO: Proteção
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    /// TODO: Proteção
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    /// TODO: Proteção
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    /// TODO: Proteção
    return this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    /// TODO: Proteção

    const { currentPassword, newPassword } = updateUserPasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async updateAvatar(id: string, avatar: string) {
    /// TODO: Proteção
    return this.prisma.user.update({
      where: { id },
      data: { avatar },
    });
  }

  async confirmUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { accountConfirmed: true },
    });
  }
}
