/**
 * Day.js Usage Examples with BudgetManager
 * Demonstrates various Day.js operations and BudgetManager integration
 */

import dayjs from 'dayjs';
import { budgetManager } from './BudgetManager';

// Example 1: Basic Day.js usage
console.log('=== Basic Day.js Usage ===');
const now = dayjs();
console.log('Current time:', now.format('YYYY-MM-DD HH:mm:ss dddd'));
console.log('ISO format:', now.toISOString());
console.log('Unix timestamp:', now.unix());

// Example 2: Date creation and manipulation
console.log('\n=== Date Creation and Manipulation ===');
const specificDate = dayjs('2025-08-14 10:30:00');
console.log('Specific date:', specificDate.format('YYYY-MM-DD HH:mm:ss'));
console.log('Add 7 days:', specificDate.add(7, 'day').format('YYYY-MM-DD'));
console.log('Subtract 1 month:', specificDate.subtract(1, 'month').format('YYYY-MM-DD'));
console.log('Start of month:', specificDate.startOf('month').format('YYYY-MM-DD HH:mm:ss'));
console.log('End of month:', specificDate.endOf('month').format('YYYY-MM-DD HH:mm:ss'));

// Example 3: Date comparisons
console.log('\n=== Date Comparisons ===');
const date1 = dayjs('2025-08-14');
const date2 = dayjs('2025-08-15');
console.log('date1 is before date2:', date1.isBefore(date2));
console.log('date1 is after date2:', date1.isAfter(date2));
console.log('date1 is same as date2:', date1.isSame(date2));
console.log('Difference in days:', date2.diff(date1, 'day'));

// Example 4: Using BudgetManager with Day.js
console.log('\n=== BudgetManager with Day.js ===');
const startDate = dayjs('2025-08-01');
const endDate = dayjs('2025-08-31');

try {
  const total = budgetManager.QueryTotalAmount(startDate, endDate);
  console.log('Total amount:', total);
} catch (error) {
  console.error('Error:', error);
}

// Example 5: Date range helpers
console.log('\n=== Date Range Helpers ===');
const monthRange = budgetManager.getCurrentMonthRange();
console.log('Current month start:', monthRange.start.format('YYYY-MM-DD HH:mm:ss'));
console.log('Current month end:', monthRange.end.format('YYYY-MM-DD HH:mm:ss'));

const todayRange = budgetManager.getDateRange('today');
console.log('Today start:', todayRange.start.format('YYYY-MM-DD HH:mm:ss'));
console.log('Today end:', todayRange.end.format('YYYY-MM-DD HH:mm:ss'));

// Example 6: Date info analysis
console.log('\n=== Date Info Analysis ===');
const dateInfo = budgetManager.getDateInfo('2025-08-14 15:30:00');
console.log('Date info:', JSON.stringify(dateInfo, null, 2));

// Example 7: Error handling with invalid dates
console.log('\n=== Error Handling ===');
try {
  const invalidStart = dayjs('2025-08-31');
  const invalidEnd = dayjs('2025-08-01');
  budgetManager.QueryTotalAmount(invalidStart, invalidEnd);
} catch (error) {
  console.error('Expected error for invalid date range:', (error as Error).message);
}

// Example 8: Different date formats
console.log('\n=== Different Date Formats ===');
const formats = [
  dayjs('2025-08-14').format('YYYY-MM-DD'),           // ISO date
  dayjs('2025-08-14').format('DD/MM/YYYY'),           // European format
  dayjs('2025-08-14').format('MM/DD/YYYY'),           // US format
  dayjs('2025-08-14').format('MMMM DD, YYYY'),        // Full month name
  dayjs('2025-08-14').format('dddd, MMMM DD, YYYY'),  // Full format
  dayjs('2025-08-14').format('HH:mm:ss'),             // Time only
];

formats.forEach((format, index) => {
  console.log(`Format ${index + 1}:`, format);
});

export { }; // Make this a module
