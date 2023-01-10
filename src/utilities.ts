import dateFormat from "dateformat";
import moment from "moment";

export const DATETIME_FORMAT_STR: string = "YYYY-MM-DD HH:mm:ss";
export const DATE_FORMAT_STR: string = "YYYY-MM-DD";

export function getCurrentTimeString(): string {
  const now: Date = new Date();
  return dateFormat(now, "yyyy-mm-dd HH:MM:ss");
}

export function matchesDateTimeFormat(dateTime: string): boolean {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTime);
}

export function matchesDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function matchesOrderNumberFormat(orderNum: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(orderNum);
}

export function dateTimeIsValid(dateTime: string, dateTimeFormat: string): boolean {
  return moment(dateTime, dateTimeFormat).isValid()
}

export function dateTimeToDate(dateTime: string, dateTimeFormat: string) {
  return moment(dateTime, dateTimeFormat).toDate();
}

export function getFormEntryString(form: FormData, name: string): string {
  return form.get(name) === null ? "" : form.get(name) as string;
}
