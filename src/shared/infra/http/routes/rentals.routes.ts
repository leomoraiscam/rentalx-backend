import { Router } from 'express';

import { ConfirmRentalController } from '@modules/rentals/useCases/confirmRental/ConfirmRentalController';
import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { ShowSummaryDetailsOfRentalController } from '@modules/rentals/useCases/showSummaryDetailsOfRental/ShowSummaryDetailsOfRentalController';
import { UpdateRentalController } from '@modules/rentals/useCases/updateRental/UpdateRentalController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rentalRouter = Router();
const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();
const showSummaryDetailsOfRentalController = new ShowSummaryDetailsOfRentalController();
const updateRentalController = new UpdateRentalController();
const confirmRentalController = new ConfirmRentalController();

rentalRouter.get('/', ensureAuthenticated, listRentalsByUserController.handle);
rentalRouter.get(
  '/:id',
  ensureAuthenticated,
  showSummaryDetailsOfRentalController.handle
);
rentalRouter.post('/', ensureAuthenticated, createRentalController.handle);
rentalRouter.post(
  '/devolution/:id',
  ensureAuthenticated,
  devolutionRentalController.handle
);
rentalRouter.put('/', ensureAuthenticated, updateRentalController.handle);
rentalRouter.patch('/:id', ensureAuthenticated, confirmRentalController.handle);

export { rentalRouter };
