/**
 * Budget Manager
 * Provides functionality for managing budget-related operations
 */

import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { budgetService } from './BudgetService';
import { Budget } from './Budget';

// Extend dayjs with plugins
dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Budget Manager class for handling budget calculations and queries
 */
export class BudgetManager {
  /**
   * Query the total amount within a specified date range
   * @param start - The start date and time for the query range (using Day.js)
   * @param end - The end date and time for the query range (using Day.js)
   * @returns The total amount as a decimal value
   */
  QueryTotalAmount(start: Dayjs, end: Dayjs): number {
    // Validate date range using Day.js
    if (start.isAfter(end)) {
      throw new Error(`Invalid date range: start date (${start.format('YYYY-MM-DD HH:mm:ss')}) must be before or equal to end date (${end.format('YYYY-MM-DD HH:mm:ss')})`);
    }
    
    // Log the date range for debugging
    console.log(`Querying budget from ${start.format('YYYY-MM-DD HH:mm:ss')} to ${end.format('YYYY-MM-DD HH:mm:ss')}`);
    
    try {
      // Get all budgets
      const allBudgets = budgetService.getAll();
      
      // Filter budgets within the date range and calculate prorated amounts
      let totalAmount = 0;
      let budgetsProcessed = 0;
      
      for (const budget of allBudgets) {
        const budgetDate = this.parseYearMonth(budget.YearMonth);
        const monthStart = budgetDate.startOf('month');
        const monthEnd = budgetDate.endOf('month');
        
        // Check if this budget month overlaps with our date range
        if (monthStart.isSameOrBefore(end, 'day') && monthEnd.isSameOrAfter(start, 'day')) {
          // Calculate the actual date range for this month within our query range
          const effectiveStart = start.isAfter(monthStart) ? start : monthStart;
          const effectiveEnd = end.isBefore(monthEnd) ? end : monthEnd;
          
          // Calculate the number of days in this month that fall within our range
          const daysInRange = effectiveEnd.diff(effectiveStart, 'day') + 1;
          const daysInMonth = monthEnd.diff(monthStart, 'day') + 1;
          
          // Calculate prorated amount
          const proratedAmount = (budget.Amount / daysInMonth) * daysInRange;
          totalAmount += proratedAmount;
          budgetsProcessed++;
          
          console.log(`Month ${budget.YearMonth}: ${daysInRange}/${daysInMonth} days, prorated amount: ${proratedAmount.toFixed(2)}`);
        }
      }
      
      console.log(`Found ${budgetsProcessed} budgets in date range, total amount: ${totalAmount.toFixed(2)}`);
      return totalAmount;
    } catch (error) {
      console.error('Error querying total amount:', error);
      throw error;
    }
  }

  /**
   * Parse YearMonth string to Day.js object
   * @param yearMonth - YearMonth string in format YYYYMM
   * @returns Day.js object representing the first day of the month
   */
  private parseYearMonth(yearMonth: string): Dayjs {
    if (!/^\d{6}$/.test(yearMonth)) {
      throw new Error(`Invalid YearMonth format: ${yearMonth}. Expected format: YYYYMM`);
    }
    
    const year = yearMonth.substring(0, 4);
    const month = yearMonth.substring(4, 6);
    
    return dayjs(`${year}-${month}-01`);
  }

  /**
   * Get budget for a specific month using Day.js
   * @param date - Day.js date object
   * @returns Budget object if found, undefined otherwise
   */
  getBudgetForMonth(date: Dayjs): Budget | undefined {
    const yearMonth = date.format('YYYYMM');
    return budgetService.getByYearMonth(yearMonth);
  }

  /**
   * Get budgets for a specific year using Day.js
   * @param year - Year as number or Day.js object
   * @returns Array of Budget objects for the specified year
   */
  getBudgetsForYear(year: number | Dayjs): Budget[] {
    const yearString = typeof year === 'number' ? year.toString() : year.format('YYYY');
    return budgetService.getByYear(yearString);
  }

  /**
   * Example helper method showing various Day.js operations
   * @param dateString - Date string to parse
   * @returns Formatted date information
   */
  getDateInfo(dateString: string): {
    original: string;
    formatted: string;
    isValid: boolean;
    dayOfWeek: string;
    quarter: number;
    isToday: boolean;
    isAfterNow: boolean;
  } {
    const date = dayjs(dateString);
    
    return {
      original: dateString,
      formatted: date.format('YYYY-MM-DD dddd HH:mm:ss'),
      isValid: date.isValid(),
      dayOfWeek: date.format('dddd'),
      quarter: (date as any).quarter(), // Using type assertion for quarter plugin
      isToday: date.isSame(dayjs(), 'day'),
      isAfterNow: date.isAfter(dayjs()),
    };
  }

  /**
   * Get current month date range using Day.js
   * @returns Object with start and end of current month
   */
  getCurrentMonthRange(): { start: Dayjs; end: Dayjs } {
    const now = dayjs();
    return {
      start: now.startOf('month'),
      end: now.endOf('month')
    };
  }

  /**
   * Get date ranges for different periods
   * @param period - The period type ('today', 'week', 'month', 'year')
   * @returns Object with start and end dates
   */
  getDateRange(period: 'today' | 'week' | 'month' | 'year'): { start: Dayjs; end: Dayjs } {
    const now = dayjs();
    
    switch (period) {
      case 'today':
        return {
          start: now.startOf('day'),
          end: now.endOf('day')
        };
      case 'week':
        return {
          start: now.startOf('week'),
          end: now.endOf('week')
        };
      case 'month':
        return {
          start: now.startOf('month'),
          end: now.endOf('month')
        };
      case 'year':
        return {
          start: now.startOf('year'),
          end: now.endOf('year')
        };
      default:
        throw new Error(`Unsupported period: ${period}`);
    }
  }
}

// Export a singleton instance for convenience
export const budgetManager = new BudgetManager();
