import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, Length } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { NotMatch } from 'src/decorators/not-match.decorator';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'Current user password',
    example: 'John123$',
  })
  @NotMatch('newPassword', {
    message: 'New password must not be the same as the current password',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New user password',
    minLength: 8,
    maxLength: 24,
    example: 'Doe1234$',
  })
  @IsStrongPassword()
  @Length(8, 24)
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new user password',
    example: 'Doe1234$',
  })
  @Match('newPassword', { message: "Passwords don't match" })
  confirmNewPassword: string;
}
