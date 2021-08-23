import { ApplicationRoles } from '../models/applicationRoles';
import { Roles } from './applicationRoles.decorators';

describe('Roles', () => {
  it('should be defined', () => {
    expect(
      Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER),
    ).not.toBeNull();
  });
});
