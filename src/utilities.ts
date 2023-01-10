/**
 * Various utility functions for working with date strings and forms.
 */

import dateFormat from "dateformat";
import moment from "moment";

export const DATETIME_FORMAT_STR: string = "YYYY-MM-DD HH:mm:ss";
export const DATE_FORMAT_STR: string = "YYYY-MM-DD";

/**
 * Returns the current time as a string.
 * 
 * @returns the current time as a string in the form 'YYYY-MM-DD HH:mm:ss'
 */
export function getCurrentTimeString(): string {
  const now: Date = new Date();
  return dateFormat(now, "yyyy-mm-dd HH:MM:ss");
}

/**
 * Returns true if the given string is in the form 'YYYY-MM-DD HH:mm:ss'.
 * 
 * @param dateTime string representing a date and time
 * @returns true if the given string is in the form 'YYYY-MM-DD HH:mm:ss'
 */
export function matchesDateTimeFormat(dateTime: string): boolean {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTime);
}

/**
 * Returns true if the given string is in the form 'YYYY-MM-DD'.
 * 
 * @param date string reprsenting a date
 * @returns true if the given string is in the form 'YYYY-MM-DD'
 */
export function matchesDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * Returns true if the given string is in the form of an order number,
 * otherwise returns false.
 * 
 * @param orderNum 
 * @returns true if the string consists of only alphanumeric characters and is
 *          nonempty, otherwise returns false
 */
export function matchesOrderNumberFormat(orderNum: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(orderNum);
}

/**
 * Returns true if the given date string represents a valid date in the
 * given format, otherwise returns false.
 * 
 * @param dateTime string representing a date (and time)
 * @param dateTimeFormat string representing a date (and time) format
 * @returns true if the given date string represents a valid date in the
 *          given format, otherwise returns false
 */
export function dateTimeIsValid(dateTime: string, dateTimeFormat: string): boolean {
  return moment(dateTime, dateTimeFormat).isValid()
}

/**
 * Returns a Date corresponding with the given date string and date format.
 * 
 * @param dateTime string representing a date (and time)
 * @param dateTimeFormat string representing a date (and time) format
 * @returns a Date corresponding with the given date string and date format
 */
export function dateTimeToDate(dateTime: string, dateTimeFormat: string): Date {
  return moment(dateTime, dateTimeFormat).toDate();
}

/**
 * Returns the value with key name from form as a string.
 * 
 * @param form the form from which to retrieve a value
 * @param name the key from which to retrieve a value in form
 * @returns the value with key name from form as a string
 */
export function getFormEntryString(form: FormData, name: string): string {
  return form.get(name) === null ? "" : form.get(name) as string;
}
