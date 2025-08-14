/**
 * Budget Model
 * Represents a budget entry with year-month and amount
 */

/**
 * Budget interface representing a single budget entry
 */
export interface Budget {
  /**
   * Year and month in format YYYYMM (e.g., "202508" for August 2025)
   */
  YearMonth: string;
  
  /**
   * Budget amount as integer
   */
  Amount: number;
}

/**
 * Type guard to check if an object is a valid Budget
 * @param obj - Object to check
 * @returns True if object is a valid Budget
 */
export function isBudget(obj: any): obj is Budget {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.YearMonth === 'string' &&
    typeof obj.Amount === 'number' &&
    /^\d{6}$/.test(obj.YearMonth); // Validates YYYYMM format
}
