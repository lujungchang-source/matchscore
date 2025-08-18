/**
 * Budget Model
 * Represents a budget entry with year-month and amount
 */

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
}
