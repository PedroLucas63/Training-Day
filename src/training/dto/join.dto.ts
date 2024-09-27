import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JoinDto {
  @ApiPropertyOptional({
    description: 'Training password',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  password: string;
}
