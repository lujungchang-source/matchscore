/**
 * MatchViewModel Edge Cases and Error Handling Tests
 */

import { MatchViewModel } from '../MatchViewModel';
import { matchService } from '../MatchService';

// Mock the MatchService
jest.mock('../MatchService', () => ({
  matchService: {
    queryMatchResult: jest.fn(),
    updateMatchResult: jest.fn(),
  },
}));

describe('MatchViewModel - Edge Cases and Error Handling', () => {
  let viewModel: MatchViewModel;
  const mockMatchService = matchService as jest.Mocked<typeof matchService>;

  beforeEach(() => {
    viewModel = new MatchViewModel();
    jest.clearAllMocks();
  });

  describe('parseMatchResultToDisplay - Edge Cases', () => {
    test('should handle undefined input', async () => {
      mockMatchService.queryMatchResult.mockReturnValue(undefined as any);
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('0:0 (First Half)'); // Should fall back to default
    });

    test('should handle null input', async () => {
      mockMatchService.queryMatchResult.mockReturnValue(null as any);
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('0:0 (First Half)'); // Should fall back to default
    });

    test('should handle very long match strings', async () => {
      // Simulate a very long match (50 goals each)
      const longMatch = 'H'.repeat(50) + 'A'.repeat(50) + ';' + 'H'.repeat(25) + 'A'.repeat(25);
      mockMatchService.queryMatchResult.mockReturnValue(longMatch);
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('75:75 (Second Half)');
    });

    test('should handle strings with only invalid characters', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('XYZ123!@#');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('0:0 (First Half)');
    });

    test('should handle mixed valid and invalid characters', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('HxHyAz;123A');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('2:2 (Second Half)');
    });

    test('should handle multiple semicolons correctly', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('HH;;;A;;;');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('2:1 (Second Half)');
    });

    test('should handle semicolon at the beginning', async () => {
      mockMatchService.queryMatchResult.mockReturnValue(';HHA');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('2:1 (Second Half)');
    });

    test('should handle empty string with semicolon', async () => {
      mockMatchService.queryMatchResult.mockReturnValue(';');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('0:0 (Second Half)');
    });

    test('should handle whitespace in match string', async () => {
      mockMatchService.queryMatchResult.mockReturnValue(' H H A ; A ');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('2:2 (Second Half)');
    });
  });

  describe('queryMatchResult - Error Scenarios', () => {
    test('should handle service returning error string', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('Error: Match not found');
      const result = await viewModel.queryMatchResult(999);
      expect(result).toBe('0:0 (First Half)'); // Error strings should be treated as no data
    });

    test('should handle service returning malformed data', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('Match ID: 123, Result: HH');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('2:0 (First Half)'); // Should parse just the HH part
    });

    test('should handle service returning number as string', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('12345');
      const result = await viewModel.queryMatchResult(123);
      expect(result).toBe('0:0 (First Half)');
    });

    test('should handle service throwing custom error', async () => {
      const customError = new Error('Database connection failed');
      customError.name = 'DatabaseError';
      mockMatchService.queryMatchResult.mockImplementation(() => {
        throw customError;
      });

      const result = await viewModel.queryMatchResult(123);
      expect(result).toContain('Error in ViewModel: DatabaseError: Database connection failed');
    });

    test('should handle service throwing non-Error object', async () => {
      mockMatchService.queryMatchResult.mockImplementation(() => {
        throw 'String error';
      });

      const result = await viewModel.queryMatchResult(123);
      expect(result).toContain('Error in ViewModel: String error');
    });
  });

  describe('Performance and Memory Tests', () => {
    test('should handle multiple rapid queries without memory leaks', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('HHA;A');
      
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(viewModel.queryMatchResult(i));
      }

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(100);
      results.forEach(result => {
        expect(result).toBe('2:2 (Second Half)');
      });
      expect(mockMatchService.queryMatchResult).toHaveBeenCalledTimes(100);
    });

    test('should handle concurrent updates and queries', async () => {
      // Setup different mock responses for different calls
      let callCount = 0;
      mockMatchService.queryMatchResult.mockImplementation(() => {
        callCount++;
        return callCount % 2 === 0 ? 'HH' : 'HA;A';
      });

      mockMatchService.updateMatchResult.mockReturnValue('Update successful');

      const queryPromises = Array(10).fill(null).map((_, i) => 
        viewModel.queryMatchResult(i)
      );
      const updatePromises = Array(10).fill(null).map((_, i) => 
        viewModel.updateMatchResult(i, 1 as any)
      );

      const [queryResults, updateResults] = await Promise.all([
        Promise.all(queryPromises),
        Promise.all(updatePromises)
      ]);

      expect(queryResults).toHaveLength(10);
      expect(updateResults).toHaveLength(10);
      updateResults.forEach(result => {
        expect(result).toBe('Update successful');
      });
    });
  });

  describe('Type Safety and Validation', () => {
    test('should handle negative match IDs', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('HH');
      const result = await viewModel.queryMatchResult(-1);
      expect(mockMatchService.queryMatchResult).toHaveBeenCalledWith(-1);
      expect(result).toBe('2:0 (First Half)');
    });

    test('should handle zero match ID', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('A');
      const result = await viewModel.queryMatchResult(0);
      expect(mockMatchService.queryMatchResult).toHaveBeenCalledWith(0);
      expect(result).toBe('0:1 (First Half)');
    });

    test('should handle very large match IDs', async () => {
      mockMatchService.queryMatchResult.mockReturnValue('HA;');
      const result = await viewModel.queryMatchResult(Number.MAX_SAFE_INTEGER);
      expect(mockMatchService.queryMatchResult).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
      expect(result).toBe('1:1 (Second Half)');
    });
  });
});
