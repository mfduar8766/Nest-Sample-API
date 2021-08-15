import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApplicationRoles } from '../models/applicationRoles';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop()
  userName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({
    required: true,
    match: RegExp(`^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$`, 'g'),
  })
  password: string;

  @Prop({ required: true, match: RegExp(`[A-Za-z0-9@.com]`, 'g') })
  email: string;

  @Prop({ required: true, default: ApplicationRoles.USER })
  roles: ApplicationRoles[];

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ default: null })
  updatedAt: Date;

  @Prop({ required: true, default: '' })
  activationCode: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
