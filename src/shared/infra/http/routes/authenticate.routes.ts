import { Router } from 'express';

import AuthenticatedUserController from '@modules/accounts/useCases/authenticateUser/AuthenticatedUserController';
import RefreshTokenController from '@modules/accounts/useCases/refreshToken/RefreshTokenController';

const authenticateRoutes = Router();
const authenticatedUserController = new AuthenticatedUserController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post('/sessions', authenticatedUserController.handle);
authenticateRoutes.post('/refresh-token', refreshTokenController.handle);

export default authenticateRoutes;
