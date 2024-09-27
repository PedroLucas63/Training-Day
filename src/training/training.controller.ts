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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Training')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @ApiOperation({
    summary: 'Create training',
  })
  @ApiResponse({
    description: 'Create training successfully',
  })
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

  @ApiOperation({
    summary: 'Get all trainings',
  })
  @ApiResponse({
    description: 'Get all trainings successfully',
    isArray: true,
  })
  @Get()
  findAll() {
    return this.trainingService.findAll();
  }

  @ApiOperation({
    summary: 'Get all available trainings',
  })
  @ApiResponse({
    description: 'Get all available trainings successfully',
    isArray: true,
  })
  @Get('/available')
  findAllAvailable() {
    return this.trainingService.findAllAvailable();
  }

  @ApiOperation({
    summary: 'Get training by id',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The id of the training',
  })
  @ApiResponse({
    description: 'Get training by id successfully',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update training',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The id of the training',
  })
  @ApiResponse({
    description: 'Update training successfully',
  })
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

  @ApiOperation({
    summary: 'Remove training',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The id of the training',
  })
  @ApiResponse({
    description: 'Remove training successfully',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.trainingService.remove(currentUser['sub'], id);
  }

  @ApiOperation({
    summary: 'Join training',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The id of the training',
  })
  @ApiResponse({
    description: 'Join training successfully',
  })
  @Patch(':id/join')
  join(
    @Param('id') id: string,
    @Body() joinDto: JoinDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.trainingService.join(id, currentUser['sub'], joinDto);
  }

  @ApiOperation({
    summary: 'Leave training',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The id of the training',
  })
  @ApiResponse({
    description: 'Leave training successfully',
  })
  @Patch(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.trainingService.leave(id, currentUser['sub']);
  }

  @ApiOperation({
    summary: 'Remove participant to training',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The id of the training',
  })
  @ApiBody({
    type: 'string',
  })
  @ApiResponse({
    description: 'Remove participant to training successfully',
  })
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
