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
  @IsString()
  @Length(3, 24)
  title: string;

  @IsString()
  @Length(3, 50)
  local: string;

  @IsDateString()
  @IsAfterDate(new Date(), { message: "Date can't be in the past" })
  occurredIn: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  maximumParticipants?: number;

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
