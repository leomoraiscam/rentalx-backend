import { Router } from 'express';

import CreateRentalcontroller from '@modules/rentals/useCases/createRental/CreateRentalController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();
const createRentalcontroller = new CreateRentalcontroller();

rentalRoutes.post('/', ensureAuthenticated, createRentalcontroller.handle);

export default rentalRoutes;
