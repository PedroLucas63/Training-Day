export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  avatar: string | '/imgs/avatars/default.png';
  createdAt: Date;
  updatedAt: Date;
}
