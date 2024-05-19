export interface ICreateUserDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  driverLicense: string;
  isAdmin?: boolean;
  avatar?: string;
}
