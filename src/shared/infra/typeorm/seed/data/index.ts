import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { CategoryType } from '@modules/cars/enums/category';

export const USER: ICreateUserDTO = {
  name: 'User admin',
  email: 'user_adm@email.com',
  password: 'adm@1234',
  driverLicense: '',
  isAdmin: true,
};

export const CATEGORIES: ICreateCategoryDTO[] = [
  {
    name: 'Esportivo Seed',
    description:
      'Projetados para otimizar a aerodinâmica, atingir velocidades maiores e oferecer um alto desempenho.',
    type: CategoryType.SPORT,
  },
  {
    name: 'Sedã Seed',
    description:
      'Categoria de carros que possui três volumes: o porta-malas, a cabine e o compartimento do motor.',
    type: CategoryType.SEDAN,
  },
];

export const SPECIFICATIONS: ICreateSpecificationDTO[] = [
  {
    name: 'Direção	Elétrica Seed',
    description: 'Direção	Elétrica',
  },
  {
    name: 'Tração Dianteira Seed',
    description: 'Tração Dianteira',
  },
  {
    name: '4 Portas Seed',
    description: '4 Portas',
  },
];
