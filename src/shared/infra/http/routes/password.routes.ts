import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';

import { ResetPasswordController } from '@modules/accounts/useCases/resetPassword/ResetPasswordController';
import { SendForgotPasswordMailController } from '@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController';

const passwordRouter = Router();
const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  sendForgotPasswordMailController.handle
);
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().min(5).max(15).required(),
    },
    [Segments.QUERY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  resetPasswordController.handle
);

export { passwordRouter };
