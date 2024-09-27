import { IDateProvider } from '../models/IDateProvider';

export class InMemoryDateProvider implements IDateProvider {
  private currentDate: Date;
  private readonly UTC_OFFSET_HOURS = 3;
  private readonly MONTH_INDEX_OFFSET = 1;
  private readonly MILLISECONDS_IN_HOUR = 1000 * 60 * 60;
  private readonly HOURS_IN_DAY = 24;
  private readonly MILLISECONDS_IN_MINUTE = 1000 * 60;

  constructor(initialDate: Date = new Date()) {
    this.currentDate = initialDate;
  }

  private getMonthName(month: number): string {
    const monthNames = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];
    return monthNames[month - this.MONTH_INDEX_OFFSET];
  }

  setCurrentDate(date: Date): void {
    this.currentDate = date;
  }

  dateNow(): Date {
    return this.currentDate;
  }

  getHours(hour: Date): string {
    return hour.toTimeString();
  }

  getDate(date: Date): string {
    const day = date.getDate();
    const month = this.getMonthName(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}, ${month} ${year}`;
  }

  addHours(hours: number): Date {
    const newDate = new Date(this.currentDate.getTime());

    newDate.setHours(
      this.currentDate.getHours() - this.UTC_OFFSET_HOURS + hours
    );

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
      Math.abs(
        new Date(endDateUTC).getTime() - new Date(startDateUTC).getTime()
      ) / this.MILLISECONDS_IN_HOUR
    );
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate);
    const startDateUTC = this.convertToUTC(startDate);

    const hoursDifference =
      Math.abs(
        new Date(endDateUTC).getTime() - new Date(startDateUTC).getTime()
      ) / this.MILLISECONDS_IN_HOUR;

    return Math.round(hoursDifference / this.HOURS_IN_DAY);
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return startDate.getTime() < endDate.getTime();
  }

  convertToUTC(date: Date): string {
    const utcDate = new Date(
      date.getTime() + date.getTimezoneOffset() * this.MILLISECONDS_IN_MINUTE
    );

    return utcDate.toISOString();
  }
}
