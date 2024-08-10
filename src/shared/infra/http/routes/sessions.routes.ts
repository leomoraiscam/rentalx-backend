import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';

import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController';

const sessionsRouter = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

const jwtRegex = /^[A-Za-z0-9-_=]+?\.[A-Za-z0-9-_=]+?\.[A-Za-z0-9-_.+/=]*$/;

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  authenticateUserController.handle
);
sessionsRouter.post(
  '/refresh-token',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().regex(jwtRegex).required().messages({
        'string.pattern.base': 'Token deve ser um JWT válido',
      }),
    },
  }),
  refreshTokenController.handle
);

export { sessionsRouter };
