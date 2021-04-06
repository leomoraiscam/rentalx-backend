import { Router } from 'express';

import CreateRentalcontroller from '@modules/rentals/useCases/createRental/CreateRentalController';
import DevolutionController from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import ListRentalsByUserController from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();
const createRentalcontroller = new CreateRentalcontroller();
const devolutionController = new DevolutionController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalRoutes.get('/', ensureAuthenticated, listRentalsByUserController.handle);
rentalRoutes.post('/', ensureAuthenticated, createRentalcontroller.handle);
rentalRoutes.post(
  '/devolution/:id',
  ensureAuthenticated,
  devolutionController.handle
);

export default rentalRoutes;
