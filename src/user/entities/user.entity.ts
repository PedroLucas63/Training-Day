export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  accountConfirmed: boolean;
  dateOfBirth?: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
