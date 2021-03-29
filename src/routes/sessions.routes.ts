import { Router } from 'express';

import AuthenticatedUserController from '@modules/accounts/useCases/authenticateUser/AuthenticatedUserController';

const sessionsRoutes = Router();
const authenticatedUserController = new AuthenticatedUserController();

sessionsRoutes.post('/sessions', authenticatedUserController.handle);

export default sessionsRoutes;
