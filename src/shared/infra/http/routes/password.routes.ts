import { Router } from 'express';

import { ResetPasswordController } from '@modules/accounts/useCases/resetPassword/ResetPasswordController';
import { SendForgotPasswordMailController } from '@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController';

const passwordRouter = Router();
const sendForgotPasswordMailController = new SendForgotPasswordMailController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', sendForgotPasswordMailController.handle);
passwordRouter.post('/reset', resetPasswordController.handle);

export { passwordRouter };
