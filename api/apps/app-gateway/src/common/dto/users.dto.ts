import { ApplicationRoles } from '../models/applicationRoles';
import { TUsers } from '../models/users.types';

export class UserModelDto implements TUsers {
  readonly _id?: string;
  readonly userName: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly age: number;
  readonly roles: ApplicationRoles[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly activationCode: string;
}
