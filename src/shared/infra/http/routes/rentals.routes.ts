import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { ShowSummaryDetailsOfRentalController } from '@modules/rentals/useCases/showSummaryDetailsOfRental/ShowSummaryDetailsOfRentalController';
import { UpdateRentalController } from '@modules/rentals/useCases/updateRental/UpdateRentalController';
import { UpdateStatusRentalController } from '@modules/rentals/useCases/updateStatusRental/UpdateStatusRentalController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rentalRouter = Router();
const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();
const showSummaryDetailsOfRentalController = new ShowSummaryDetailsOfRentalController();
const updateRentalController = new UpdateRentalController();
const updateStatusRentalController = new UpdateStatusRentalController();

rentalRouter.get('/', ensureAuthenticated, listRentalsByUserController.handle);
rentalRouter.get(
  '/:id',
  ensureAuthenticated,
  showSummaryDetailsOfRentalController.handle
);
rentalRouter.post('/', ensureAuthenticated, createRentalController.handle);
rentalRouter.put('/', ensureAuthenticated, updateRentalController.handle);
rentalRouter.post(
  '/devolution/:id',
  ensureAuthenticated,
  devolutionRentalController.handle
);
rentalRouter.patch(
  '/:id',
  ensureAuthenticated,
  updateStatusRentalController.handle
);

export { rentalRouter };
