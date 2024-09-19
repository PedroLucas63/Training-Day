import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateAndUpdateTrainingDto } from './dto/create-and-update-training.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JoinDto } from './dto/join.dto';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post()
  create(
    @Body() createAndUpdateTrainingDto: CreateAndUpdateTrainingDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.trainingService.create(
      currentUser['sub'],
      createAndUpdateTrainingDto,
    );
  }

  @Get()
  findAll() {
    return this.trainingService.findAll();
  }

  @Get('/available')
  findAllAvailable() {
    return this.trainingService.findAllAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() createAndUpdateTrainingDto: CreateAndUpdateTrainingDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.trainingService.update(
      currentUser['sub'],
      id,
      createAndUpdateTrainingDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.trainingService.remove(currentUser['sub'], id);
  }

  @Patch(':id/join')
  join(
    @Param('id') id: string,
    @Body() joinDto: JoinDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.trainingService.join(id, currentUser['sub'], joinDto);
  }

  @Patch(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.trainingService.leave(id, currentUser['sub']);
  }

  @Patch(':id/remove-participant')
  removeParticipant(
    @Param('id') id: string,
    @Body() participantId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.trainingService.removeParticipant(
      currentUser['sub'],
      id,
      participantId,
    );
  }
}
