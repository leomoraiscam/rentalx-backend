import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';

import { CancelRentalController } from '@modules/rentals/useCases/cancelRental/CancelRentalController';
import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsController } from '@modules/rentals/useCases/listRentals/ListRentalsController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { PickupRentalController } from '@modules/rentals/useCases/pickupRental/PickupRentalController';
import { ShowRentalController } from '@modules/rentals/useCases/showRental/ShowRentalController';
import { UpdateRentalController } from '@modules/rentals/useCases/updateRental/UpdateRentalController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rentalRouter = Router();
const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const showRentalController = new ShowRentalController();
const updateRentalController = new UpdateRentalController();
const pickupRentalController = new PickupRentalController();
const cancelRentalController = new CancelRentalController();
const listRentalsController = new ListRentalsController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      status: Joi.string(),
      categoryIds: Joi.string(),
    },
  }),
  ensureAuthenticated,
  listRentalsController.handle
);
rentalRouter.get(
  '/me',
  ensureAuthenticated,
  listRentalsByUserController.handle
);
rentalRouter.get('/:id', ensureAuthenticated, showRentalController.handle);
rentalRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.date().required(),
      expectedReturnDate: Joi.date().required(),
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
  pickupRentalController.handle
);
rentalRouter.put(
  '/:id/cancel',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  cancelRentalController.handle
);

export { rentalRouter };
