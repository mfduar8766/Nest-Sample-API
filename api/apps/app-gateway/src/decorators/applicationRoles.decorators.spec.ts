import { Roles } from './applicationRoles.decorators';
import { ApplicationRoles } from '@app/shared-modules';

describe('Roles', () => {
  it('should be defined', () => {
    expect(
      Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER),
    ).not.toBeNull();
  });
});
