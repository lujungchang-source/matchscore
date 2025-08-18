/**
 * Budget Service
 * Provides functionality for managing budget data operations
 */

import { Budget } from './Budget';

/**
 * Budget Service class for handling budget-related data operations
 */
export class BudgetService {
  // Mock data for demonstration purposes
  private mockBudgets: Budget[] = [
    new Budget("202501", 15000),
    new Budget("202502", 18000),
    new Budget("202503", 22000),
    new Budget("202504", 19500),
    new Budget("202505", 21000),
    new Budget("202506", 17500),
    new Budget("202507", 23000),
    new Budget("202508", 20000),
    new Budget("202509", 18500),
    new Budget("202510", 25000),
    new Budget("202511", 19000),
    new Budget("202512", 24000),
  ];

  /**
   * Get all budget entries
   * @returns Array of all Budget objects
   */
  getAll(): Budget[] {
    try {
      // TODO: Replace with actual database query or API call
      // For now, return mock data
      return [...this.mockBudgets]; // Return a copy to prevent external modifications
    } catch (error) {
      console.error('Error retrieving budgets:', error);
      throw new Error(`Failed to retrieve budgets: ${error}`);
    }
  }

  /**
   * Get budget by specific year-month
   * @param yearMonth - Year-month in format YYYYMM (e.g., "202508")
   * @returns Budget object if found, undefined otherwise
   */
  getByYearMonth(yearMonth: string): Budget | undefined {
    try {
      // Validate YearMonth format
      if (!/^\d{6}$/.test(yearMonth)) {
        throw new Error(`Invalid YearMonth format: ${yearMonth}. Expected format: YYYYMM`);
      }

      return this.mockBudgets.find(budget => budget.YearMonth === yearMonth);
    } catch (error) {
      console.error('Error retrieving budget by YearMonth:', error);
      throw error;
    }
  }

  /**
   * Get budgets for a specific year
   * @param year - Year as string (e.g., "2025")
   * @returns Array of Budget objects for the specified year
   */
  getByYear(year: string): Budget[] {
    try {
      if (!/^\d{4}$/.test(year)) {
        throw new Error(`Invalid year format: ${year}. Expected format: YYYY`);
      }

      return this.mockBudgets.filter(budget => budget.YearMonth.startsWith(year));
    } catch (error) {
      console.error('Error retrieving budgets by year:', error);
      throw error;
    }
  }

  /**
   * Add a new budget entry
   * @param budget - Budget object to add
   * @returns The added Budget object
   */
  add(budget: Budget): Budget {
    try {
      // Validate that it's a Budget instance
      if (!Budget.isBudget(budget)) {
        throw new Error('Invalid budget object provided');
      }

      // Check if budget for this YearMonth already exists
      const existingBudget = this.mockBudgets.find(b => b.YearMonth === budget.YearMonth);
      if (existingBudget) {
        throw new Error(`Budget for YearMonth ${budget.YearMonth} already exists`);
      }

      // Add to mock data
      this.mockBudgets.push(budget);
      
      // TODO: Replace with actual database insert or API call
      return budget;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  }

  /**
   * Update an existing budget entry
   * @param budget - Budget object with updated values
   * @returns The updated Budget object
   */
  update(budget: Budget): Budget {
    try {
      // Validate that it's a Budget instance
      if (!Budget.isBudget(budget)) {
        throw new Error('Invalid budget object provided');
      }

      // Find existing budget
      const index = this.mockBudgets.findIndex(b => b.YearMonth === budget.YearMonth);
      if (index === -1) {
        throw new Error(`Budget for YearMonth ${budget.YearMonth} not found`);
      }

      // Update mock data
      this.mockBudgets[index] = budget;
      
      // TODO: Replace with actual database update or API call
      return budget;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Delete a budget entry by YearMonth
   * @param yearMonth - Year-month in format YYYYMM
   * @returns True if deleted successfully, false if not found
   */
  delete(yearMonth: string): boolean {
    try {
      // Validate YearMonth format
      if (!/^\d{6}$/.test(yearMonth)) {
        throw new Error(`Invalid YearMonth format: ${yearMonth}. Expected format: YYYYMM`);
      }

      // Find and remove from mock data
      const index = this.mockBudgets.findIndex(budget => budget.YearMonth === yearMonth);
      if (index === -1) {
        return false; // Budget not found
      }

      this.mockBudgets.splice(index, 1);
      
      // TODO: Replace with actual database delete or API call
      return true;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  /**
   * Get total amount for all budgets
   * @returns Total amount as number
   */
  getTotalAmount(): number {
    try {
      return this.mockBudgets.reduce((total, budget) => total + budget.Amount, 0);
    } catch (error) {
      console.error('Error calculating total amount:', error);
      throw error;
    }
  }
}

// Export a singleton instance for convenience
export const budgetService = new BudgetService();
