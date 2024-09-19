import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TrainingController],
  providers: [TrainingService, PrismaService],
})
export class TrainingModule {}
