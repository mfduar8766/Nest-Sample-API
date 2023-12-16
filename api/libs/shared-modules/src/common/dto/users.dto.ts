import { ApplicationRoles } from '../models/applicationRoles';
import { TUsers } from '../models/users.types';

export class UserModelDto implements TUsers {
  constructor(
    public readonly userName: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly age: number,
    public readonly roles: ApplicationRoles[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly activationCode: string,
    public readonly _id?: string,
  ) {}
}
