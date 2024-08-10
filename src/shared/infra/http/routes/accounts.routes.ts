import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { multerConfig } from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const uploadAvatar = multer(multerConfig);

const accountsRouter = Router();
const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

accountsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(15).required(),
      driverLicense: Joi.string().min(9).max(9).required(),
    },
  }),
  createUserController.handle
);
accountsRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);

export { accountsRouter };
