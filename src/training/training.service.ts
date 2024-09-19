import { Training } from './entities/training.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAndUpdateTrainingDto } from './dto/create-and-update-training.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JoinDto } from './dto/join.dto';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}

  async create(
    creatorId: string,
    createAndUpdateTrainingDto: CreateAndUpdateTrainingDto,
  ) {
    if (createAndUpdateTrainingDto.password) {
      const salt = await bcrypt.genSalt();
      createAndUpdateTrainingDto.password = await bcrypt.hash(
        createAndUpdateTrainingDto.password,
        salt,
      );
    }

    try {
      const training = await this.prisma.training.create({
        data: {
          ...createAndUpdateTrainingDto,
          creatorId,
        },
      });

      const participant = await this.prisma.trainingParticipants.create({
        data: {
          trainingId: training.id,
          participantId: creatorId,
        },
      });

      return { training, participant };
    } catch (error) {
      throw new Error("Couldn't create training");
    }
  }

  async findAll() {
    return this.prisma.training.findMany({
      include: {
        _count: {
          select: { TrainingParticipants: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.training.findUnique({
      where: { id },
      include: {
        TrainingParticipants: true,
      },
    });
  }

  async findAllAvailable() {
    return this.prisma.training.findMany({
      where: {
        occurredIn: {
          gte: new Date(),
        },
      },
    });
  }

  async update(
    creatorId: string,
    id: string,
    createAndUpdateTrainingDto: CreateAndUpdateTrainingDto,
  ) {
    try {
      const training = await this.prisma.training.findUnique({
        where: { id },
        include: {
          _count: {
            select: { TrainingParticipants: true },
          },
        },
      });

      if (!training) {
        throw new ForbiddenException('Training not found');
      } else if (training.creatorId !== creatorId) {
        throw new ForbiddenException(
          "You don't have permission to update this training",
        );
      }

      if (
        createAndUpdateTrainingDto.maximumParticipants &&
        training._count.TrainingParticipants >
          createAndUpdateTrainingDto.maximumParticipants
      ) {
        throw new ForbiddenException('Maximum participants reached');
      }

      if (createAndUpdateTrainingDto.password) {
        const salt = await bcrypt.genSalt();
        createAndUpdateTrainingDto.password = await bcrypt.hash(
          createAndUpdateTrainingDto.password,
          salt,
        );
      }

      return this.prisma.training.update({
        where: { id },
        data: {
          ...createAndUpdateTrainingDto,
        },
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error("Couldn't update training");
    }
  }

  async remove(creatorId: string, id: string) {
    try {
      const training = await this.prisma.training.findUnique({
        where: { id },
      });

      if (!training) {
        throw new ForbiddenException('Training not found');
      } else if (training.creatorId !== creatorId) {
        throw new ForbiddenException(
          "You don't have permission to remove this training",
        );
      }

      return this.prisma.training.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error("Couldn't remove training");
    }
  }

  async join(trainingId: string, participantId: string, joinDto: JoinDto) {
    try {
      const training = await this.prisma.training.findUnique({
        where: { id: trainingId },
        include: {
          TrainingParticipants: true,
        },
      });

      if (training.occurredIn < new Date()) {
        throw new ForbiddenException('Training has already occurred');
      } else if (
        training.maximumParticipants &&
        training.TrainingParticipants.length >= training.maximumParticipants
      ) {
        throw new ForbiddenException('Training is full');
      } else if (
        training.TrainingParticipants.some(
          (participant) => participant.participantId === participantId,
        )
      ) {
        throw new ForbiddenException('Already joined');
      } else if (training.password) {
        if (!joinDto.password) {
          throw new ForbiddenException('Password is required');
        }

        const samePasswords = await bcrypt.compare(
          joinDto.password,
          training.password,
        );

        if (!samePasswords) {
          throw new ForbiddenException('Wrong password');
        }
      }

      const participant = await this.prisma.trainingParticipants.create({
        data: {
          trainingId,
          participantId,
        },
      });

      return participant;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error("Couldn't join training");
    }
  }

  async leave(trainingId: string, participantId: string) {
    try {
      const training = await this.prisma.training.findUnique({
        where: { id: trainingId },
        include: {
          TrainingParticipants: true,
        },
      });

      if (!training) {
        throw new ForbiddenException('Training not found');
      } else if (training.occurredIn < new Date()) {
        throw new ForbiddenException('Training has already occurred');
      }

      const trainingParticipant =
        await this.prisma.trainingParticipants.findFirst({
          where: { trainingId, participantId },
        });

      if (!trainingParticipant) {
        throw new ForbiddenException('Participant not found');
      }

      const deleteParticipant = await this.prisma.trainingParticipants.delete({
        where: { id: trainingParticipant.id },
      });

      if (training.TrainingParticipants.length === 1) {
        await this.prisma.training.delete({
          where: { id: trainingId },
        });
      }

      return deleteParticipant;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error("Couldn't leave training");
    }
  }

  async removeParticipant(
    creatorId: string,
    trainingId: string,
    participantId: string,
  ) {
    try {
      const training = await this.prisma.training.findUnique({
        where: { id: trainingId },
      });

      if (!training) {
        throw new ForbiddenException('Training not found');
      } else if (training.creatorId !== creatorId) {
        throw new ForbiddenException(
          "You don't have permission to remove this participant",
        );
      }

      return this.leave(trainingId, participantId);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new Error("Couldn't remove participant");
    }
  }
}
