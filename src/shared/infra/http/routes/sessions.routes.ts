import { Router } from 'express';

import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController';

const sessionsRouter = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

sessionsRouter.post('/', authenticateUserController.handle);
sessionsRouter.post('/refresh-token', refreshTokenController.handle);

export { sessionsRouter };
