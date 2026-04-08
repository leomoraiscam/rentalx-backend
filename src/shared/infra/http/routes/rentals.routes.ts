import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';

import { CancelRentalController } from '@modules/rentals/useCases/cancelRental/CancelRentalController';
import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DetailRentalController } from '@modules/rentals/useCases/detailRental/DetailRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsController } from '@modules/rentals/useCases/listRentals/ListRentalsController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { PickupRentalController } from '@modules/rentals/useCases/pickupRental/PickupRentalController';
import { UpdateRentalController } from '@modules/rentals/useCases/updateRental/UpdateRentalController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rentalRouter = Router();
const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const detailRentalController = new DetailRentalController();
const updateRentalController = new UpdateRentalController();
const pickupRentalController = new PickupRentalController();
const cancelRentalController = new CancelRentalController();
const listRentalsController = new ListRentalsController();
const listRentalsByUserController = new ListRentalsByUserController();

const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

rentalRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      status: Joi.string(),
      categoryIds: Joi.string(),
      page: Joi.string(),
      perPage: Joi.string(),
      order: Joi.string()
        .valid(...Object.values(['ASC', 'DESC']))
        .optional(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  listRentalsController.handle
);
rentalRouter.get(
  '/me',
  celebrate({
    [Segments.QUERY]: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      status: Joi.string(),
      page: Joi.string(),
      perPage: Joi.string(),
      order: Joi.string()
        .valid(...Object.values(['ASC', 'DESC']))
        .optional(),
    },
  }),
  ensureAuthenticated,
  listRentalsByUserController.handle
);
rentalRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  detailRentalController.handle
);
rentalRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.string()
        .required()
        .pattern(dateTimeRegex)
        .message('"startDate" must be in the format YYYY-MM-DD HH:mm:ss'),
      expectedReturnDate: Joi.string()
        .required()
        .pattern(dateTimeRegex)
        .message(
          '"expectedReturnDate" must be in the format YYYY-MM-DD HH:mm:ss'
        ),
      carId: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  createRentalController.handle
);
rentalRouter.put(
  '/:id/devolution',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  devolutionRentalController.handle
);
rentalRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      startDate: Joi.date().optional(),
      expectedReturnDate: Joi.date().optional(),
      carId: Joi.string().uuid().optional(),
    },
  }),
  ensureAuthenticated,
  updateRentalController.handle
);
rentalRouter.put(
  '/:id/pickup',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  pickupRentalController.handle
);
rentalRouter.put(
  '/:id/cancel',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  cancelRentalController.handle
);

export { rentalRouter };
