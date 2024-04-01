export interface ICreateUserDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  driverLicense: string;
  avatar?: string;
}
