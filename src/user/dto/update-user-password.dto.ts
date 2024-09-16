import { IsStrongPassword } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { NotMatch } from 'src/decorators/not-match.decorator';

export class UpdateUserPasswordDto {
  @IsStrongPassword()
  @NotMatch('newPassword', {
    message: 'New password must not be the same as the current password',
  })
  currentPassword: string;

  @IsStrongPassword()
  newPassword: string;

  @Match('newPassword', { message: "Passwords don't match" })
  confirmNewPassword: string;
}
