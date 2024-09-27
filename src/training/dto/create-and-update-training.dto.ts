import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Min,
} from 'class-validator';
import { IsAfterDate } from 'src/decorators/is-after-date.decorator';

export class CreateAndUpdateTrainingDto {
  @ApiProperty({
    description: 'Training title',
    minLength: 3,
    maxLength: 24,
    example: 'Training 1',
  })
  @IsString()
  @Length(3, 24)
  title: string;

  @ApiProperty({
    description: 'Training local',
    minLength: 3,
    maxLength: 50,
    example: 'Local 1',
  })
  @IsString()
  @Length(3, 50)
  local: string;

  @ApiProperty({
    description: 'Training date',
    example: new Date('2025-12-24').toISOString(),
  })
  @IsDateString()
  @IsAfterDate(new Date(), { message: "Date can't be in the past" })
  occurredIn: Date;

  @ApiPropertyOptional({
    description: 'Maximum participants',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maximumParticipants?: number;

  @ApiPropertyOptional({
    description: 'Training password',
    example: '1234',
    minLength: 4,
  })
  @IsOptional()
  @IsStrongPassword({
    minLength: 4,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minLowercase: 0,
  })
  password?: string;
}
