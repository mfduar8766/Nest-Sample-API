import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ApplicationRoles } from '../models/applicationRoles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ApplicationRoles[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
