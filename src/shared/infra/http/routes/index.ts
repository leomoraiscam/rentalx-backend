import { Router } from 'express';

import authenticateRoutes from './authenticate.routes';
import carsRoutes from './cars.routes';
import categoriesRoutes from './categories.routes';
import rentalRoutes from './rental.routes';
import speficationRoutes from './specification.routes';
import userRoutes from './users.routes';

const routes = Router();

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', speficationRoutes);
routes.use('/users', userRoutes);
routes.use(authenticateRoutes);
routes.use('/cars', carsRoutes);
routes.use('/rentals', rentalRoutes);

export default routes;
