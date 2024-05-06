export interface IDateProvider {
  dateNow(): Date;
  getHours(hour: Date): string;
  addHours(hours: number): Date;
  addDays(days: number): Date;
  compareInHours(startDate: Date, endDate: Date): number;
  compareInDays(startDate: Date, dateNow: Date): number;
  compareIfBefore(startDate: Date, endDate: Date): boolean;
  convertToUTC(date: Date): string;
}
