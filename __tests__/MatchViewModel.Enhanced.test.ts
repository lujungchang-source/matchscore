/**
 * Enhanced MatchViewModel Tests - updateMatchResult method focus
 */

import { MatchViewModel, matchViewModel } from '../MatchViewModel';
import { matchService, Event } from '../MatchService';

// Mock the MatchService
jest.mock('../MatchService', () => ({
  matchService: {
    queryMatchResult: jest.fn(),
    updateMatchResult: jest.fn(),
  },
  Event: {
    HomeGoal: 1,
    AwayGoal: 2,
    CancelHomeGoal: 3,
    CancelAwayGoal: 4,
    NextPeriod: 5,
  }
}));

describe('MatchViewModel - updateMatchResult Enhanced Tests', () => {
  let viewModel: MatchViewModel;
  const mockMatchService = matchService as jest.Mocked<typeof matchService>;

  beforeEach(() => {
    viewModel = new MatchViewModel();
    jest.clearAllMocks();
  });

  describe('updateMatchResult method', () => {
    test('should handle HomeGoal event successfully', async () => {
      const expectedResult = 'Match 123 updated successfully: Home team scored a goal (Event: 1)';
      mockMatchService.updateMatchResult.mockReturnValue(expectedResult);

      const result = await viewModel.updateMatchResult(123, Event.HomeGoal);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(123, Event.HomeGoal);
      expect(result).toBe(expectedResult);
    });

    test('should handle AwayGoal event successfully', async () => {
      const expectedResult = 'Match 456 updated successfully: Away team scored a goal (Event: 2)';
      mockMatchService.updateMatchResult.mockReturnValue(expectedResult);

      const result = await viewModel.updateMatchResult(456, Event.AwayGoal);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(456, Event.AwayGoal);
      expect(result).toBe(expectedResult);
    });

    test('should handle CancelHomeGoal event successfully', async () => {
      const expectedResult = 'Match 789 updated successfully: Home team goal cancelled (Event: 3)';
      mockMatchService.updateMatchResult.mockReturnValue(expectedResult);

      const result = await viewModel.updateMatchResult(789, Event.CancelHomeGoal);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(789, Event.CancelHomeGoal);
      expect(result).toBe(expectedResult);
    });

    test('should handle CancelAwayGoal event successfully', async () => {
      const expectedResult = 'Match 101 updated successfully: Away team goal cancelled (Event: 4)';
      mockMatchService.updateMatchResult.mockReturnValue(expectedResult);

      const result = await viewModel.updateMatchResult(101, Event.CancelAwayGoal);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(101, Event.CancelAwayGoal);
      expect(result).toBe(expectedResult);
    });

    test('should handle NextPeriod event successfully', async () => {
      const expectedResult = 'Match 202 updated successfully: Next period started (Event: 5)';
      mockMatchService.updateMatchResult.mockReturnValue(expectedResult);

      const result = await viewModel.updateMatchResult(202, Event.NextPeriod);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(202, Event.NextPeriod);
      expect(result).toBe(expectedResult);
    });

    test('should handle service throwing UpdateMatchResultException', async () => {
      const error = new Error('Update Match Result Exception, Event: 3, originalMatchResult: AA');
      mockMatchService.updateMatchResult.mockImplementation(() => {
        throw error;
      });

      const result = await viewModel.updateMatchResult(303, Event.CancelHomeGoal);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(303, Event.CancelHomeGoal);
      expect(result).toBe(`Error in ViewModel update: ${error}`);
    });

    test('should handle service throwing generic error', async () => {
      const error = new Error('Network connection failed');
      mockMatchService.updateMatchResult.mockImplementation(() => {
        throw error;
      });

      const result = await viewModel.updateMatchResult(404, Event.HomeGoal);

      expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(404, Event.HomeGoal);
      expect(result).toBe(`Error in ViewModel update: ${error}`);
    });

    test('should handle all event types in sequence', async () => {
      const events = [
        { event: Event.HomeGoal, matchId: 100, expected: 'Home goal added' },
        { event: Event.AwayGoal, matchId: 100, expected: 'Away goal added' },
        { event: Event.CancelHomeGoal, matchId: 100, expected: 'Home goal cancelled' },
        { event: Event.CancelAwayGoal, matchId: 100, expected: 'Away goal cancelled' },
        { event: Event.NextPeriod, matchId: 100, expected: 'Next period started' },
      ];

      for (const testCase of events) {
        mockMatchService.updateMatchResult.mockReturnValue(testCase.expected);
        
        const result = await viewModel.updateMatchResult(testCase.matchId, testCase.event);
        
        expect(result).toBe(testCase.expected);
        expect(mockMatchService.updateMatchResult).toHaveBeenCalledWith(testCase.matchId, testCase.event);
      }
    });
  });

  describe('integration between queryMatchResult and updateMatchResult', () => {
    test('should handle complete workflow: query -> update -> query', async () => {
      // Initial query shows 1:0
      mockMatchService.queryMatchResult.mockReturnValue('H');
      let result = await viewModel.queryMatchResult(500);
      expect(result).toBe('1:0 (First Half)');

      // Update with AwayGoal
      const updateResult = 'Match 500 updated successfully: Away team scored a goal (Event: 2)';
      mockMatchService.updateMatchResult.mockReturnValue(updateResult);
      const updateResponse = await viewModel.updateMatchResult(500, Event.AwayGoal);
      expect(updateResponse).toBe(updateResult);

      // Query again should show 1:1
      mockMatchService.queryMatchResult.mockReturnValue('HA');
      result = await viewModel.queryMatchResult(500);
      expect(result).toBe('1:1 (First Half)');
    });

    test('should handle cancel operations workflow', async () => {
      // Start with 2:1 second half
      mockMatchService.queryMatchResult.mockReturnValue('HHA;');
      let result = await viewModel.queryMatchResult(600);
      expect(result).toBe('2:1 (Second Half)');

      // Cancel home goal
      mockMatchService.updateMatchResult.mockReturnValue('Home goal cancelled');
      const cancelResult = await viewModel.updateMatchResult(600, Event.CancelHomeGoal);
      expect(cancelResult).toBe('Home goal cancelled');

      // Should now be 1:1
      mockMatchService.queryMatchResult.mockReturnValue('HA;');
      result = await viewModel.queryMatchResult(600);
      expect(result).toBe('1:1 (Second Half)');
    });
  });
});
