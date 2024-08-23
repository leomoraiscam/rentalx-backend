import crypto from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

export enum UploadFolder {
  AVATAR = 'avatar',
  CARS = 'cars',
  TMP = 'tmp',
}

const tmpFolder = resolve(__dirname, '..', '..', UploadFolder.TMP);

export const multerConfig = {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(8).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
