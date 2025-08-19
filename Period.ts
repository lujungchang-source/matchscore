import { Dayjs } from 'dayjs';
import { Budget } from './Budget';

/**
 * Represents a date period with start and end dates
 */
export class Period {
  /**
   * Calculate the number of overlapping days between a budget month and this period
   * @param budget - The budget object
   * @returns Number of overlapping days (0 if no overlap)
   */
  public overlappingDays(budget: Budget): number {
    // Check if this budget month overlaps with our date range
    if ((budget.firstDay()).isSameOrBefore(this.end, 'day') && (budget.lastDay()).isSameOrAfter(this.start, 'day')) {
      // Calculate the actual date range for this month within our query range
      const effectiveStart = this.start.isAfter(budget.firstDay()) ? this.start : budget.firstDay();
      const effectiveEnd = this.end.isBefore(budget.lastDay()) ? this.end : budget.lastDay();
      // Calculate the number of days in this month that fall within our range
      return effectiveEnd.diff(effectiveStart, 'day') + 1;
    }
    return 0;
  }
  private _start: Dayjs;
  private _end: Dayjs;

  constructor(start: Dayjs, end: Dayjs) {
    this._start = start;
    this._end = end;
  }

  get start(): Dayjs {
    return this._start;
  }

  set start(value: Dayjs) {
    this._start = value;
  }

  get end(): Dayjs {
    return this._end;
  }

  set end(value: Dayjs) {
    this._end = value;
  }
}
