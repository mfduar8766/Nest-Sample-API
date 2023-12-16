import { CustomDecorator, SetMetadata } from '@nestjs/common';
<<<<<<< HEAD:api/apps/app-gateway/src/decorators/applicationRoles.decorators.ts
import { ApplicationRoles } from '@app/shared-modules';
=======
import { ApplicationRoles } from '../common/models'
>>>>>>> 8112c2d71290c0c501d2f16a9dd5b865668014b5:services/app-gateway/src/decorators/applicationRoles.decorators.ts

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ApplicationRoles[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
