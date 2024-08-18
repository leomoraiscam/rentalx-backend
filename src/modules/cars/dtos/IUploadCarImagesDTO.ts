export interface IUploadCarImagesDTO {
  carId: string;
  images: Express.Multer.File[];
}
