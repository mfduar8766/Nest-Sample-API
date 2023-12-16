<<<<<<< HEAD:api/apps/app-gateway/src/decorators/applicationRoles.decorators.spec.ts
=======
import { ApplicationRoles } from '../common/models';
>>>>>>> 8112c2d71290c0c501d2f16a9dd5b865668014b5:services/app-gateway/src/decorators/applicationRoles.decorators.spec.ts
import { Roles } from './applicationRoles.decorators';
import { ApplicationRoles } from '@app/shared-modules';

describe('Roles', () => {
  it('should be defined', () => {
    expect(
      Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER),
    ).not.toBeNull();
  });
});
