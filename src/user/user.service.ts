import {
  ConflictException,
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
///TODO: Tratar saídas
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

    try {
      const createdUser: User = await this.prisma.user.create({ data: user });

      await this.mailService.sendUserConfirmation(createdUser);

      return createdUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      return user;
    } catch (error) {
      if (error.message === 'P2025') {
        throw new NotFoundException("User doesn't exist");
      } else if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });

      return user;
    } catch (error) {
      if (error.message === 'P2025') {
        throw new NotFoundException("User doesn't exist");
      }
    }
  }

  async updatePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
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
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { avatar },
      });

      return user;
    } catch (error) {
      if (error.message === 'P2025') {
        throw new NotFoundException("User doesn't exist");
      }
    }
  }

  async sendEmailConfirmation(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    if (!user.accountConfirmed) {
      await this.mailService.sendUserConfirmation(user);
    }
  }

  async confirmUser(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { accountConfirmed: true },
      });

      return user;
    } catch (error) {
      if (error.message === 'P2025') {
        throw new NotFoundException("User doesn't exist");
      }
    }
  }

  async findCreatedTrainings(id: string) {
    try {
      const trainings = await this.prisma.training.findMany({
        where: { creatorId: id },
      });

      return trainings;
    } catch (error) {
      throw new Error("Couldn't get trainings");
    }
  }

  async findAllTrainings(id: string) {
    try {
      const trainings = await this.prisma.training.findMany({
        where: {
          TrainingParticipants: {
            some: {
              participantId: id,
            },
          },
        },
      });

      return trainings;
    } catch (error) {
      throw new Error("Couldn't get trainings");
    }
  }
}
