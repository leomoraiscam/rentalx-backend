import SpecificationRespository from '../../repositories/implementations/SpecificationRepository';
import CreateSpecificationController from './CreateSpecificationController';
import CreateSpecificationUseCase from './CreateSpecificationUseCase';

const specificationRespository = SpecificationRespository.getInstance();
const createSpecificationUseCase = new CreateSpecificationUseCase(
  specificationRespository
);
const createSpecificationController = new CreateSpecificationController(
  createSpecificationUseCase
);

export default createSpecificationController;
