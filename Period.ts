/**
 * Period class for handling date ranges
 * Provides functionality for managing start and end date pairs
 */

import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type { Budget } from './Budget';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Period class for handling date ranges with start and end dates
 */
export class Period {
  private readonly _start: Dayjs;
  private readonly _end: Dayjs;

  /**
   * Create a new Period instance
   * @param start - The start date and time (using Day.js)
   * @param end - The end date and time (using Day.js)
   */
  constructor(start: Dayjs, end: Dayjs) {
    if (start.isAfter(end)) {
      throw new Error(`Invalid period: start date (${start.format('YYYY-MM-DD HH:mm:ss')}) must be before or equal to end date (${end.format('YYYY-MM-DD HH:mm:ss')})`);
    }
    
    this._start = start;
    this._end = end;
  }

  // #region Properties

  /**
   * Get the start date of the period
   * @returns The start date as a Day.js object
   */
  get start(): Dayjs {
    return this._start;
  }

  /**
   * Get the end date of the period
   * @returns The end date as a Day.js object
   */
  get end(): Dayjs {
    return this._end;
  }

  // #endregion

  // #region Duration Methods

  /**
   * Calculate the duration of the period in days
   * @returns The number of days in the period (inclusive)
   */
  getDurationInDays(): number {
    return this._end.diff(this._start, 'day') + 1;
  }

  /**
   * Calculate the duration of the period in hours
   * @returns The number of hours in the period
   */
  getDurationInHours(): number {
    return this._end.diff(this._start, 'hour');
  }

  // #endregion

  // #region Comparison Methods

  /**
   * Check if a date falls within this period
   * @param date - The date to check
   * @returns True if the date is within the period, false otherwise
   */
  contains(date: Dayjs): boolean {
    return date.isSameOrAfter(this._start, 'day') && date.isSameOrBefore(this._end, 'day');
  }

  /**
   * Check if this period overlaps with another period
   * @param other - The other period to check for overlap
   * @returns True if the periods overlap, false otherwise
   */
  overlaps(other: Period): boolean {
    return this._start.isSameOrBefore(other._end, 'day') && this._end.isSameOrAfter(other._start, 'day');
  }

  /**
   * Check if this period is entirely before another period
   * @param other - The other period to compare with
   * @returns True if this period is entirely before the other
   */
  isBefore(other: Period): boolean {
    return this._end.isBefore(other._start, 'day');
  }

  /**
   * Check if this period is entirely after another period
   * @param other - The other period to compare with
   * @returns True if this period is entirely after the other
   */
  isAfter(other: Period): boolean {
    return this._start.isAfter(other._end, 'day');
  }

  // #endregion

  // #region Overlap Calculations

  /**
   * Get the overlapping period between this and another period
   * @param other - The other period to find overlap with
   * @returns A new Period representing the overlap, or null if no overlap exists
   */
  getOverlap(other: Period): Period | null {
    if (!this.overlaps(other)) {
      return null;
    }

    const overlapStart = this._start.isAfter(other._start) ? this._start : other._start;
    const overlapEnd = this._end.isBefore(other._end) ? this._end : other._end;

    return new Period(overlapStart, overlapEnd);
  }

  /**
   * Calculate the number of overlapping days between this period and another period
   * @param anotherPeriod - The other period to check for overlap
   * @returns The number of overlapping days
   */
  overlappingDay(anotherPeriod: Period): number {
    // Check if this period overlaps with the other period
    if (anotherPeriod.start.isSameOrBefore(this._end, 'day') && anotherPeriod.end.isSameOrAfter(this._start, 'day')) {
      // Calculate the actual date range for this period within our query range
      const effectiveStart = this._start.isAfter(anotherPeriod.start) ? this._start : anotherPeriod.start;
      const effectiveEnd = this._end.isBefore(anotherPeriod.end) ? this._end : anotherPeriod.end;

      // Calculate the number of days in this period that fall within our range
      return effectiveEnd.diff(effectiveStart, 'day') + 1;
    }
    return 0;
  }

  // #endregion

  // #region Utility Methods

  /**
   * Get a string representation of the period
   * @param format - The format string for displaying dates (default: 'YYYY-MM-DD')
   * @returns A string representation of the period
   */
  toString(format: string = 'YYYY-MM-DD'): string {
    return `${this._start.format(format)} to ${this._end.format(format)}`;
  }

  // #endregion

  // #region Static Factory Methods

  /**
   * Create a Period from a specific date (same day start to end)
   * @param date - The date to create a single-day period for
   * @returns A new Period for the specified day
   */
  static fromDate(date: Dayjs): Period {
    return new Period(date.startOf('day'), date.endOf('day'));
  }

  /**
   * Create a Period for today
   * @returns A new Period for today
   */
  static today(): Period {
    const now = dayjs();
    return new Period(now.startOf('day'), now.endOf('day'));
  }

  /**
   * Create a Period for the current week
   * @returns A new Period for the current week
   */
  static currentWeek(): Period {
    const now = dayjs();
    return new Period(now.startOf('week'), now.endOf('week'));
  }

  /**
   * Create a Period for the current month
   * @returns A new Period for the current month
   */
  static currentMonth(): Period {
    const now = dayjs();
    return new Period(now.startOf('month'), now.endOf('month'));
  }

  /**
   * Create a Period for the current year
   * @returns A new Period for the current year
   */
  static currentYear(): Period {
    const now = dayjs();
    return new Period(now.startOf('year'), now.endOf('year'));
  }

  /**
   * Create a Period for a specific month and year
   * @param year - The year
   * @param month - The month (1-12)
   * @returns A new Period for the specified month
   */
  static forMonth(year: number, month: number): Period {
    const date = dayjs().year(year).month(month - 1); // month is 0-indexed in dayjs
    return new Period(date.startOf('month'), date.endOf('month'));
  }

  /**
   * Create a Period for a specific year
   * @param year - The year
   * @returns A new Period for the specified year
   */
  static forYear(year: number): Period {
    const date = dayjs().year(year);
    return new Period(date.startOf('year'), date.endOf('year'));
  }

  // #endregion
}
