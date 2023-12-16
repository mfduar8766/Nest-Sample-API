import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/applicationRoles.decorators';
<<<<<<< HEAD:api/apps/app-gateway/src/guards/applicationRoles.guard.ts
=======
import { ApplicationRoles } from '../common/models';
>>>>>>> 8112c2d71290c0c501d2f16a9dd5b865668014b5:services/app-gateway/src/guards/applicationRoles.guard.ts
import { Request } from 'express';
import { ApplicationRoles } from '@app/shared-modules';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ApplicationRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    if (request?.headers?.roles.length) {
      return requiredRoles.some((role: ApplicationRoles) =>
        request.headers.roles.includes(role),
      );
    }
    return false;
  }
}
