import { ApplicationRoles } from './applicationRoles';

export interface IUsers {
  _id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  password: string;
  roles: ApplicationRoles[];
  createdAt: Date;
  updatedAt: Date;
  activationCode: string;
}
