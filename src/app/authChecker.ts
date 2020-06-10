import { AuthChecker } from 'type-graphql';
import { IContext } from '.';

export const customAuthChecker: AuthChecker<IContext> = (
  { root, args, context: { user }, info },
  roles
) => {
  if (!user) {
    return false;
  }

  if (roles.length && !roles.includes(user.role)) {
    return false;
  }

  return true; // or false if access is denied
};
