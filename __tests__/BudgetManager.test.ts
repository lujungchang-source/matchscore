/**
 * Tests for BudgetManager with Day.js integration
 */

import dayjs from 'dayjs';
import { BudgetManager, budgetManager } from '../BudgetManager';
import { budgetService } from '../BudgetService';
import { Budget } from '../Budget';

// Mock the BudgetService to control test data
jest.mock('../BudgetService', () => ({
  budgetService: {
    getAll: jest.fn(),
  },
}));

describe('BudgetManager with Day.js', () => {
  let manager: BudgetManager;
  const mockBudgetService = budgetService as jest.Mocked<typeof budgetService>;

  beforeEach(() => {
    manager = new BudgetManager();
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    // Clear all mocks
    jest.clearAllMocks();
    // Provide default mock data for existing tests
    mockBudgetService.getAll.mockReturnValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('QueryTotalAmount', () => {
    test('should accept Day.js objects and return 0 for valid date range', () => {
      const start = dayjs('2025-08-01');
      const end = dayjs('2025-08-31');

      const result = manager.QueryTotalAmount(start, end);

      expect(result).toBe(0);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Querying budget from 2025-08-01 00:00:00 to 2025-08-31 00:00:00')
      );
    });

    test('should throw error for invalid date range (start after end)', () => {
      const start = dayjs('2025-08-31');
      const end = dayjs('2025-08-01');

      expect(() => {
        manager.QueryTotalAmount(start, end);
      }).toThrow('Invalid date range: start date (2025-08-31 00:00:00) must be before or equal to end date (2025-08-01 00:00:00)');
    });

    test('should accept same start and end dates', () => {
      const date = dayjs('2025-08-15');

      const result = manager.QueryTotalAmount(date, date);

      expect(result).toBe(0);
    });

    describe('with date range 2025/07/30 to 2025/08/14', () => {
      test('should calculate total amount for budgets within the specified date range', () => {
        // Arrange
        const startDate = dayjs('2025-07-30');
        const endDate = dayjs('2025-08-14');

        // Mock budget data - including months within and outside the range
        const mockBudgets = [
          new Budget("202507", 3100), // July 2025 - within range
          new Budget("202508", 310), // August 2025 - within range
        ];

        mockBudgetService.getAll.mockReturnValue(mockBudgets);

        // Act
        const result = manager.QueryTotalAmount(startDate, endDate);

        // Assert
        // Should include July (202507) and August (202508) budgets
        const expectedTotal = 3100 / 31 * 2 + 310 / 31 * 14; // July: 2 days (30-31), August: 14 days (1-14)
        expect(result).toBeCloseTo(expectedTotal);
        expect(mockBudgetService.getAll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getDateInfo', () => {
    test('should return correct date information for valid date string', () => {
      const dateString = '2025-08-14 15:30:00';
      
      const result = manager.getDateInfo(dateString);

      expect(result.original).toBe(dateString);
      expect(result.isValid).toBe(true);
      expect(result.formatted).toContain('2025-08-14');
      expect(result.dayOfWeek).toBe('Thursday');
      expect(typeof result.quarter).toBe('number');
      expect(result.quarter).toBeGreaterThanOrEqual(1);
      expect(result.quarter).toBeLessThanOrEqual(4);
    });

    test('should handle invalid date strings', () => {
      const result = manager.getDateInfo('invalid-date');

      expect(result.original).toBe('invalid-date');
      expect(result.isValid).toBe(false);
    });

    test('should correctly identify today', () => {
      const today = dayjs().format('YYYY-MM-DD');
      
      const result = manager.getDateInfo(today);

      expect(result.isToday).toBe(true);
    });
  });

  describe('getCurrentMonthRange', () => {
    test('should return start and end of current month', () => {
      const result = manager.getCurrentMonthRange();
      const now = dayjs();

      expect(result.start.format('YYYY-MM-DD')).toBe(now.startOf('month').format('YYYY-MM-DD'));
      expect(result.end.format('YYYY-MM-DD')).toBe(now.endOf('month').format('YYYY-MM-DD'));
      expect(result.start.hour()).toBe(0);
      expect(result.start.minute()).toBe(0);
      expect(result.start.second()).toBe(0);
      expect(result.end.hour()).toBe(23);
      expect(result.end.minute()).toBe(59);
      expect(result.end.second()).toBe(59);
    });
  });

  describe('getDateRange', () => {
    test('should return correct range for today', () => {
      const result = manager.getDateRange('today');
      const now = dayjs();

      expect(result.start.format('YYYY-MM-DD')).toBe(now.format('YYYY-MM-DD'));
      expect(result.end.format('YYYY-MM-DD')).toBe(now.format('YYYY-MM-DD'));
      expect(result.start.hour()).toBe(0);
      expect(result.end.hour()).toBe(23);
    });

    test('should return correct range for this week', () => {
      const result = manager.getDateRange('week');
      const now = dayjs();

      // Check that start and end are in the same week by comparing the week of year
      const startWeekOfYear = result.start.format('YYYY-ww');
      const endWeekOfYear = result.end.format('YYYY-ww');
      const nowWeekOfYear = now.format('YYYY-ww');

      expect(startWeekOfYear).toBe(nowWeekOfYear);
      expect(endWeekOfYear).toBe(nowWeekOfYear);
    });

    test('should return correct range for this month', () => {
      const result = manager.getDateRange('month');
      const now = dayjs();

      expect(result.start.month()).toBe(now.month());
      expect(result.end.month()).toBe(now.month());
      expect(result.start.date()).toBe(1);
      expect(result.end.date()).toBe(now.endOf('month').date());
    });

    test('should return correct range for this year', () => {
      const result = manager.getDateRange('year');
      const now = dayjs();

      expect(result.start.year()).toBe(now.year());
      expect(result.end.year()).toBe(now.year());
      expect(result.start.format('MM-DD')).toBe('01-01');
      expect(result.end.format('MM-DD')).toBe('12-31');
    });

    test('should throw error for unsupported period', () => {
      expect(() => {
        manager.getDateRange('invalid' as any);
      }).toThrow('Unsupported period: invalid');
    });
  });

  describe('singleton instance', () => {
    test('should export a working singleton instance', () => {
      expect(budgetManager).toBeInstanceOf(BudgetManager);
      
      const start = dayjs('2025-01-01');
      const end = dayjs('2025-01-31');
      
      const result = budgetManager.QueryTotalAmount(start, end);
      expect(result).toBe(0);
    });
  });
});
