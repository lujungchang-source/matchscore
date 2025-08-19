/**
 * Budget Model
 * Represents a budget entry with year-month and amount
 */

import dayjs, { Dayjs } from 'dayjs';

/**
 * Budget class representing a single budget entry
 */
export class Budget {
  /**
   * Calculate the overlapping amount for this budget and a given period
   * @param period - The period to compare
   * @returns The overlapping amount as a decimal value
   */
  overlappingAmount(period: import('./Period').Period): number {
    return this.dailyAmount() * period.overlappingDays(this.createPeriod());
  }
  /**
   * Create a Period instance for this budget's date range
   * @returns Period instance for the budget's date range
   */
  private createPeriod(): import('./Period').Period {
    return new (require('./Period').Period)(this.firstDay(), this.lastDay());
  }
  private _yearMonth!: string;
  private _amount!: number;

  /**
   * Creates a new Budget instance
   * @param yearMonth - Year and month in format YYYYMM (e.g., "202508" for August 2025)
   * @param amount - Budget amount as integer
   */
  constructor(yearMonth: string, amount: number) {
    this.YearMonth = yearMonth; // Use setter for validation
    this.Amount = amount; // Use setter for validation
  }

  /**
   * Gets the year-month value
   */
  get YearMonth(): string {
    return this._yearMonth;
  }

  /**
   * Sets the year-month value with validation
   */
  set YearMonth(value: string) {
    if (typeof value !== 'string' || !/^\d{6}$/.test(value)) {
      throw new Error('YearMonth must be a string in YYYYMM format');
    }
    this._yearMonth = value;
  }

  /**
   * Gets the budget amount
   */
  get Amount(): number {
    return this._amount;
  }

  /**
   * Sets the budget amount with validation
   */
  set Amount(value: number) {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new Error('Amount must be an integer');
    }
    this._amount = value;
  }

  /**
   * Static method to check if an object is a valid Budget
   * @param obj - Object to check
   * @returns True if object is a valid Budget
   */
  static isBudget(obj: any): obj is Budget {
    return obj instanceof Budget;
  }

  /**
   * Get the first day of the budget month as a Day.js object
   * @returns Day.js object representing the first day of the month
   */
  private firstDay(): Dayjs {
    return dayjs(this.YearMonth);
  }

  /**
   * Get the last day of the budget month as a Day.js object
   * @returns Day.js object representing the last day of the month
   */
  private lastDay(): Dayjs {
    return this.firstDay().endOf('month');
  }

  /**
   * Get the number of days in the budget month
   * @returns Number of days in the budget month
   */
  private daysOfBudget(): number {
    return this.lastDay().diff(this.firstDay(), 'day') + 1;
  }

  /**
   * Get the daily amount for this budget
   * @returns Daily amount as a decimal value
   */
  dailyAmount(): number {
    return this.Amount / this.daysOfBudget();
  }

  /**
   * Creates a copy of the Budget instance
   * @returns New Budget instance with the same values
   */
  clone(): Budget {
    return new Budget(this.YearMonth, this.Amount);
  }

  /**
   * Converts the budget to a string representation
   * @returns String representation of the budget
   */
  toString(): string {
    return `Budget(${this.YearMonth}, ${this.Amount})`;
  }
}
