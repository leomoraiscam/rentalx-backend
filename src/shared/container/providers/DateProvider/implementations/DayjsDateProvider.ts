import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../models/IDateProvider';

dayjs.extend(utc, localizedFormat);

export class DayjsDateProvider implements IDateProvider {
  dateNow(): Date {
    return dayjs().toDate();
  }

  getHours(hour: Date): string {
    return dayjs(hour).format('HH:mm:ss');
  }

  getDate(date: Date): string {
    return dayjs(date).format('DD, MMM YYYY');
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate();
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }

  compareInHours(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate);
    const startDateUTC = this.convertToUTC(startDate);

    return dayjs(endDateUTC).diff(startDateUTC, 'hours');
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate);
    const startDateUTC = this.convertToUTC(startDate);

    return dayjs(endDateUTC).diff(startDateUTC, 'days');
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate);
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
}
