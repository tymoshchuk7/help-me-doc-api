import { IJwtUser, User } from './index';

declare global {
  namespace Express {
    interface Request {
      auth: IJwtUser,
      user: User,
    }
  }
}
//
// declare namespace Express {
//   export interface Request {
//     auth: IJwtUser,
//     user: User,
//   }
// }
//
// export {};