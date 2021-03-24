import { Router } from 'express';

import categoriesRoutes from './categories.routes';
import speficationRoutes from './specification.routes';

const routes = Router();

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', speficationRoutes);

export default routes;
