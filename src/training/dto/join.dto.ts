import { IsOptional, IsString } from 'class-validator';

export class JoinDto {
  @IsOptional()
  @IsString()
  password: string;
}
