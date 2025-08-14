/**
 * Test suite for BudgetManager QueryTotalAmount method
 */

import dayjs from 'dayjs';
import { BudgetManager } from '../BudgetManager';
import { budgetService } from '../BudgetService';

// Mock the BudgetService to control test data
jest.mock('../BudgetService', () => ({
  budgetService: {
    getAll: jest.fn(),
  },
}));

describe('BudgetManager QueryTotalAmount', () => {
  let budgetManager: BudgetManager;
  const mockBudgetService = budgetService as jest.Mocked<typeof budgetService>;

  beforeEach(() => {
    budgetManager = new BudgetManager();
    jest.clearAllMocks();
  });

  describe('QueryTotalAmount with date range 2025/07/30 to 2025/08/14', () => {
    it('should calculate total amount for budgets within the specified date range', () => {
      // Arrange
      const startDate = dayjs('2025-07-30');
      const endDate = dayjs('2025-08-14');

      // Mock budget data - including months within and outside the range
      const mockBudgets = [
        { YearMonth: "202507", Amount: 3100 }, // July 2025 - within range
        { YearMonth: "202508", Amount: 310 }, // August 2025 - within range
      ];

      mockBudgetService.getAll.mockReturnValue(mockBudgets);

      // Act
      const result = budgetManager.QueryTotalAmount(startDate, endDate);

      // Assert
      // Should include July (202507) and August (202508) budgets
      const expectedTotal = 3100 / 31 * 2 + 310 / 31 * 14; // July: 2 days (30-31), August: 14 days (1-14)
      expect(result).toBeCloseTo(expectedTotal);
      expect(mockBudgetService.getAll).toHaveBeenCalledTimes(1);
    });

    
  });


});
