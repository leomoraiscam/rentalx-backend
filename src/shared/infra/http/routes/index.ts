import { Router } from 'express';

import { accountsRouter } from './accounts.routes';
import { carsRouter } from './cars.routes';
import { categoriesRouter } from './categories.routes';
import { passwordRouter } from './password.routes';
import { rentalRouter } from './rentals.routes';
import { sessionsRouter } from './sessions.routes';
import { specificationRouter } from './specifications.routes';

const router = Router();

router.use('/accounts', accountsRouter);
router.use('/sessions', sessionsRouter);
router.use('/password', passwordRouter);
router.use('/categories', categoriesRouter);
router.use('/specifications', specificationRouter);
router.use('/cars', carsRouter);
router.use('/rentals', rentalRouter);

export { router };
