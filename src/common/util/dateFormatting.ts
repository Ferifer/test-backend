import * as moment from 'moment';

// Utility function to format date string to Date object using Moment.js
export function formatToDate(dateString: string, format: string): Date {
  return moment(dateString, format).toDate();
}

export function formatFromDate(date: Date): string {
  return moment(date).format('DD-MM-YYYY');
}
