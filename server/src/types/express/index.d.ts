import { UserResponse } from '@community-ai/shared';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}
