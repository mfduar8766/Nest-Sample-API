import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorators';
import { ApplicationRoles } from 'src/models/applicationRoles';
import { IUsers } from 'src/models/users.interface';

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
    const request = context.switchToHttp().getRequest();
    if (request?.body) {
      const requestBody: IUsers = request.body;
      return requiredRoles.some((role: ApplicationRoles) =>
        requestBody.roles.includes(role),
      );
    }
    return false;
  }
}
