import { Router } from 'express';

import { accountsRouter } from './accounts.routes';
import carsRoutes from './cars.routes';
import { categoriesRouter } from './categories.routes';
import { passwordRouter } from './password.routes';
import rentalRoutes from './rental.routes';
import { sessionsRouter } from './sessions.routes';
import speficationRoutes from './specification.routes';

const router = Router();

router.use('/sessions', sessionsRouter);
router.use('/accounts', accountsRouter);
router.use('/password', passwordRouter);

router.use('/categories', categoriesRouter);
router.use('/specifications', speficationRoutes);
router.use('/cars', carsRoutes);
router.use('/rentals', rentalRoutes);

export { router };
