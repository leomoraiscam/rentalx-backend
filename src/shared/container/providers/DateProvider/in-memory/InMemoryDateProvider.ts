import { IDateProvider } from '../models/IDateProvider';

export class InMemoryDateProvider implements IDateProvider {
  private currentDate: Date;

  constructor(initialDate: Date = new Date()) {
    this.currentDate = initialDate;
  }

  setCurrentDate(date: Date): void {
    this.currentDate = date;
  }

  dateNow(): Date {
    return this.currentDate;
  }

  addHours(hours: number): Date {
    const newDate = new Date(this.currentDate.getTime());

    newDate.setHours(this.currentDate.getHours() + hours);

    return newDate;
  }

  addDays(days: number): Date {
    const newDate = new Date(this.currentDate.getTime());

    newDate.setDate(this.currentDate.getDate() + days);

    return newDate;
  }

  compareInHours(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate);
    const startDateUTC = this.convertToUTC(startDate);

    return (
      Math.abs(new Date(endDateUTC).getTime() - new Date(startDateUTC).getTime()) / (1000 * 60 * 60)
    );
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate);
    const startDateUTC = this.convertToUTC(startDate);

    const hoursDifference =
      Math.abs(new Date(endDateUTC).getTime() - new Date(startDateUTC).getTime()) /
      (1000 * 60 * 60);

    return Math.round(hoursDifference / 24);
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return startDate.getTime() < endDate.getTime();
  }

  convertToUTC(date: Date): string {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  }
}
