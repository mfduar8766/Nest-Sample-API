import { Schema } from 'mongoose';
import { ApplicationRoles } from './applicationRoles';

export type TUsers = {
  _id?: Schema.Types.ObjectId;
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
};
