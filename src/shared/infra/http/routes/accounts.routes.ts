import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { uploadImage } from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { ProfileUserController } from '@modules/accounts/useCases/profileUser/ProfileUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { extractFileNames } from '../middlewares/extractFileNames';
import { handleUploadErrors } from '../middlewares/handleUploadErrors';
import { requireFile } from '../middlewares/requireFile';

const uploadAvatar = multer(uploadImage);
const accountsRouter = Router();
const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const profileUserController = new ProfileUserController();

accountsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(15).required(),
      driverLicense: Joi.string().min(9).max(11).required(),
    },
  }),
  createUserController.handle
);
accountsRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  requireFile,
  extractFileNames,
  handleUploadErrors,
  updateUserAvatarController.handle
);
accountsRouter.get('/me', ensureAuthenticated, profileUserController.handle);

export { accountsRouter };
