import { ApplicationRoles } from 'src/models/applicationRoles';
import { IUsers } from '../models/users.interface';

export class UserModelDto implements IUsers {
  readonly _id?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly age: number;
  readonly roles: ApplicationRoles[];
}
