import crypto from 'crypto';
import { Request } from 'express';
import * as fs from 'fs';
import multer, { MulterError } from 'multer';
import { resolve, extname } from 'path';

import { ILimitMulterConfig, IMulterConfig } from './dtos/multerConfigDTO';

export enum UploadFolder {
  AVATAR = 'avatar',
  CARS = 'cars',
  TMP = 'tmp',
}

export const TMP_FOLDER = resolve(__dirname, '..', '..', UploadFolder.TMP);
const FILE_SIZE_MULTIPLICATION = 1024 * 1024;
const ALLOWED_DEFAULT_IMAGES_EXTENSION_FILES = ['.jpg', '.png'];
const ALLOWED_DEFAULT_IMAGES_MIMETYPES = ['image/jpeg', 'image/png'];
const ALLOWED_CSV_MIMETYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/plain',
];
const ALLOWED_CSV_EXTENSION_FILE = ['.csv'];

export const FILE_SIZE_CONFIG = {
  DEFAULT_LIMIT_MB: 2,
  CSV_FILE_SIZE: 8,
};

export const setupUploadFolders = (): void => {
  const tmpAvatarPath = resolve(TMP_FOLDER, UploadFolder.AVATAR);
  const tmpCarsPath = resolve(TMP_FOLDER, UploadFolder.CARS);

  fs.mkdirSync(TMP_FOLDER, { recursive: true });
  fs.mkdirSync(tmpAvatarPath, { recursive: true });
  fs.mkdirSync(tmpCarsPath, { recursive: true });
};

export const multerConfig: IMulterConfig<multer.StorageEngine> = {
  tmpFolder: TMP_FOLDER,
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename: (_, file, callback) => {
      const fileHash = crypto.randomBytes(8).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

const limitsConfig = (limit: number): ILimitMulterConfig => {
  return {
    limits: {
      fileSize: limit * FILE_SIZE_MULTIPLICATION,
    },
  };
};

const fileFilterConfig = (
  allowedMimes: string[],
  allowedExtensions: string[]
) => (_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new MulterError(
        'INVALID_FORMAT_FILE' as multer.ErrorCode,
        `Apenas aquivos com o mimetype ${allowedMimes.join(
          ', '
        )} são permitidos.`
      )
    );
  }

  const extension = extname(file.originalname);

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new MulterError(
        'INVALID_FORMAT_FILE' as multer.ErrorCode,
        `Apenas aquivos com a extensões ${allowedExtensions.join(
          ', '
        )} são permitidos.`
      )
    );
  }

  return cb(null, true);
};

export const uploadImage: multer.Options = {
  storage: multerConfig.storage,
  limits: limitsConfig(FILE_SIZE_CONFIG.DEFAULT_LIMIT_MB).limits,
  fileFilter: fileFilterConfig(
    ALLOWED_DEFAULT_IMAGES_MIMETYPES,
    ALLOWED_DEFAULT_IMAGES_EXTENSION_FILES
  ),
};

export const uploadCSVFile: multer.Options = {
  storage: multerConfig.storage,
  limits: limitsConfig(FILE_SIZE_CONFIG.CSV_FILE_SIZE).limits,
  fileFilter: fileFilterConfig(
    ALLOWED_CSV_MIMETYPES,
    ALLOWED_CSV_EXTENSION_FILE
  ),
};
