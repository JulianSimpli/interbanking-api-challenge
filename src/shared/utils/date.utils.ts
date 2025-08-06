import { dayjs } from './dayjs.config';

/**
 * Converts any date input to UTC Date object
 */
export function toUTCDate(value: string | Date | number): Date {
  return dayjs(value).utc().toDate();
}

/**
 * Gets current UTC date
 */
export function now(): Date {
  return dayjs().utc().toDate();
}

/**
 * Subtracts days from current date and returns UTC Date
 */
export function daysAgo(days: number): Date {
  return dayjs().subtract(days, 'day').utc().toDate();
}

/**
 * Subtracts months from current date and returns UTC Date
 */
export function monthsAgo(months: number): Date {
  return dayjs().subtract(months, 'month').utc().toDate();
}
