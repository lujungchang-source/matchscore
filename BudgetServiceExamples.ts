/**
 * Budget Service Usage Examples
 * Demonstrates how to use BudgetService and BudgetManager
 */

import dayjs from 'dayjs';
import { budgetService, BudgetService } from './BudgetService';
import { budgetManager } from './BudgetManager';
import { Budget } from './Budget';

// Example 1: Basic BudgetService usage
console.log('=== Basic BudgetService Usage ===');

// Get all budgets
const allBudgets = budgetService.getAll();
console.log('All budgets:', allBudgets);
console.log('Total number of budgets:', allBudgets.length);

// Get budget for specific month (August 2025)
const augustBudget = budgetService.getByYearMonth('202508');
console.log('August 2025 budget:', augustBudget);

// Get all budgets for 2025
const budgets2025 = budgetService.getByYear('2025');
console.log('All 2025 budgets:', budgets2025);
console.log('Number of 2025 budgets:', budgets2025.length);

// Calculate total amount for all budgets
const totalAmount = budgetService.getTotalAmount();
console.log('Total amount of all budgets:', totalAmount);

// Example 2: CRUD operations
console.log('\n=== CRUD Operations ===');

// Add a new budget
try {
  const newBudget: Budget = {
    YearMonth: '202601', // January 2026
    Amount: 30000
  };
  
  const addedBudget = budgetService.add(newBudget);
  console.log('Added new budget:', addedBudget);
  
  // Update the budget
  const updatedBudget: Budget = {
    YearMonth: '202601',
    Amount: 35000 // Increased amount
  };
  
  const updated = budgetService.update(updatedBudget);
  console.log('Updated budget:', updated);
  
  // Get updated budget to verify
  const retrieved = budgetService.getByYearMonth('202601');
  console.log('Retrieved updated budget:', retrieved);
  
  // Delete the budget
  const deleted = budgetService.delete('202601');
  console.log('Budget deleted successfully:', deleted);
  
} catch (error) {
  console.error('Error in CRUD operations:', error);
}

// Example 3: BudgetManager integration with Day.js
console.log('\n=== BudgetManager with Day.js Integration ===');

try {
  // Query total amount for a specific month range
  const startDate = dayjs('2025-06-01');
  const endDate = dayjs('2025-08-31');
  
  const totalForPeriod = budgetManager.QueryTotalAmount(startDate, endDate);
  console.log(`Total amount from ${startDate.format('YYYY-MM-DD')} to ${endDate.format('YYYY-MM-DD')}:`, totalForPeriod);
  
  // Get budget for current month
  const currentMonth = dayjs();
  const currentMonthBudget = budgetManager.getBudgetForMonth(currentMonth);
  console.log(`Budget for ${currentMonth.format('YYYY-MM')}:`, currentMonthBudget);
  
  // Get all budgets for current year
  const currentYearBudgets = budgetManager.getBudgetsForYear(2025);
  console.log(`Budgets for 2025:`, currentYearBudgets);
  console.log(`Number of budgets in 2025:`, currentYearBudgets.length);
  
} catch (error) {
  console.error('Error in BudgetManager operations:', error);
}

// Example 4: Date range queries
console.log('\n=== Date Range Queries ===');

try {
  // Query for first quarter of 2025
  const q1Start = dayjs('2025-01-01');
  const q1End = dayjs('2025-03-31');
  const q1Total = budgetManager.QueryTotalAmount(q1Start, q1End);
  console.log(`Q1 2025 total (${q1Start.format('YYYY-MM-DD')} to ${q1End.format('YYYY-MM-DD')}):`, q1Total);
  
  // Query for second half of 2025
  const h2Start = dayjs('2025-07-01');
  const h2End = dayjs('2025-12-31');
  const h2Total = budgetManager.QueryTotalAmount(h2Start, h2End);
  console.log(`H2 2025 total (${h2Start.format('YYYY-MM-DD')} to ${h2End.format('YYYY-MM-DD')}):`, h2Total);
  
  // Query for entire year 2025
  const yearStart = dayjs('2025-01-01');
  const yearEnd = dayjs('2025-12-31');
  const yearTotal = budgetManager.QueryTotalAmount(yearStart, yearEnd);
  console.log(`Full year 2025 total (${yearStart.format('YYYY-MM-DD')} to ${yearEnd.format('YYYY-MM-DD')}):`, yearTotal);
  
} catch (error) {
  console.error('Error in date range queries:', error);
}

// Example 5: Error handling
console.log('\n=== Error Handling Examples ===');

try {
  // Try to get budget with invalid YearMonth
  budgetService.getByYearMonth('invalid');
} catch (error) {
  console.log('Expected error for invalid YearMonth:', (error as Error).message);
}

try {
  // Try to add budget with invalid YearMonth
  const invalidBudget: Budget = {
    YearMonth: '25-08', // Invalid format
    Amount: 1000
  };
  budgetService.add(invalidBudget);
} catch (error) {
  console.log('Expected error for invalid budget format:', (error as Error).message);
}

try {
  // Try to query with invalid date range
  const invalidStart = dayjs('2025-12-01');
  const invalidEnd = dayjs('2025-01-01');
  budgetManager.QueryTotalAmount(invalidStart, invalidEnd);
} catch (error) {
  console.log('Expected error for invalid date range:', (error as Error).message);
}

export { }; // Make this a module
