import { IsStrongPassword, Length } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { NotMatch } from 'src/decorators/not-match.decorator';

export class UpdateUserPasswordDto {
  @NotMatch('newPassword', {
    message: 'New password must not be the same as the current password',
  })
  currentPassword: string;

  @IsStrongPassword()
  @Length(8, 24)
  newPassword: string;

  @Match('newPassword', { message: "Passwords don't match" })
  confirmNewPassword: string;
}
