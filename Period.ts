import { Dayjs } from 'dayjs';
import { Budget } from './Budget';

/**
 * Represents a date period with start and end dates
 */
export class Period {
  /**
   * Calculate the number of overlapping days between this period and another period
   * @param otherPeriod - The other period to compare
   * @returns Number of overlapping days (0 if no overlap)
   */
  public overlappingDays(another: Period): number {
    // Return 0 if there is no overlap
    if (another.end.isBefore(this.start, 'day') || another.start.isAfter(this.end, 'day')) {
      return 0;
    }
    // Calculate the actual date range for the overlap
    const effectiveStart = this.start.isAfter(another.start) ? this.start : another.start;
    const effectiveEnd = this.end.isBefore(another.end) ? this.end : another.end;
    // Calculate the number of days in the overlap
    return effectiveEnd.diff(effectiveStart, 'day') + 1;
  }
  private readonly _start: Dayjs;
  private readonly _end: Dayjs;

  constructor(start: Dayjs, end: Dayjs) {
    this._start = start;
    this._end = end;
  }

  get start(): Dayjs {
    return this._start;
  }


  get end(): Dayjs {
    return this._end;
  }

}
