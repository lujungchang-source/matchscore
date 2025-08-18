/**
 * Budget Model
 * Represents a budget entry with year-month and amount
 */

import dayjs, { Dayjs } from 'dayjs';
import { Period } from './Period';

/**
 * Budget class representing a single budget entry
 */
export class Budget {
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

  // #region Properties

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

  // #endregion

  // #region Date Methods

  /**
   * Gets the first day of the month for this budget
   * @returns Day.js object representing the first day of the month
   */
  private firstDay(): Dayjs {
    if (!/^\d{6}$/.test(this.YearMonth)) {
      throw new Error(`Invalid YearMonth format: ${this.YearMonth}. Expected format: YYYYMM`);
    }
    
    const year = this.YearMonth.substring(0, 4);
    const month = this.YearMonth.substring(4, 6);
    
    return dayjs(`${year}-${month}-01`).startOf('month');
  }

  /**
   * Gets the last day of the month for this budget
   * @returns Day.js object representing the last day of the month
   */
  private lastDay(): Dayjs {
    return this.firstDay().endOf('month');
  }

  /**
   * Create a Period from this Budget
   * @returns A new Period representing the budget's date range
   */
  createPeriod(): Period {
    return new Period(this.firstDay(), this.lastDay());
  }

  // #endregion

  // #region Amount Calculations

  /**
   * Calculate the daily amount for this budget
   * @returns The daily amount as a decimal value
   */
  private dailyAmount(): number {
    return this.Amount / (this.lastDay().diff(this.firstDay(), 'day') + 1);
  }

  /**
   * Calculate the overlapping amount for this budget within a period
   * @param period - The period to check for overlap
   * @returns The overlapping amount as a decimal value
   */
  overlappingAmount(period: Period): number {
    return this.dailyAmount() * period.overlappingDay(this.createPeriod());
  }

  // #endregion

  // #region Utility Methods

  /**
   * Converts the Budget instance to a plain object
   * @returns Plain object representation of the Budget
   */
  toObject(): { YearMonth: string; Amount: number } {
    return {
      YearMonth: this.YearMonth,
      Amount: this.Amount
    };
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

  // #endregion

  // #region Static Methods

  /**
   * Static method to check if an object is a valid Budget
   * @param obj - Object to check
   * @returns True if object is a valid Budget
   */
  static isBudget(obj: any): obj is Budget {
    return obj instanceof Budget;
  }

  /**
   * Static factory method to create a Budget from a plain object
   * @param obj - Plain object with YearMonth and Amount properties
   * @returns Budget instance
   */
  static fromObject(obj: any): Budget {
    if (!obj || typeof obj !== 'object') {
      throw new Error('Object is required');
    }
    if (typeof obj.YearMonth !== 'string' || !/^\d{6}$/.test(obj.YearMonth)) {
      throw new Error('YearMonth must be a string in YYYYMM format');
    }
    if (typeof obj.Amount !== 'number' || !Number.isInteger(obj.Amount)) {
      throw new Error('Amount must be an integer');
    }
    return new Budget(obj.YearMonth, obj.Amount);
  }

  // #endregion
}
