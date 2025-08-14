/**
 * Test Cancel Home Goal and Cancel Away Goal button integration
 */

import { updateMatchResult, Event } from '../MatchResultUpdater';

describe('Cancel Button Integration', () => {
  test('should handle Cancel Home Goal correctly', () => {
    const result = updateMatchResult(123, Event.CancelHomeGoal, 'HHA');
    expect(result).toBe('HA'); // Should remove the last 'H'
  });

  test('should handle Cancel Away Goal correctly', () => {
    const result = updateMatchResult(123, Event.CancelAwayGoal, 'HHA');
    expect(result).toBe('HH'); // Should remove the 'A'
  });

  test('should handle Cancel Home Goal in second half', () => {
    const result = updateMatchResult(123, Event.CancelHomeGoal, 'HHA;H');
    expect(result).toBe('HHA;'); // Should remove the 'H' from second half
  });

  test('should handle Cancel Away Goal in second half', () => {
    const result = updateMatchResult(123, Event.CancelAwayGoal, 'HHA;A');
    expect(result).toBe('HHA;'); // Should remove the 'A' from second half
  });

  test('should throw exception when trying to cancel non-existent home goal', () => {
    expect(() => {
      updateMatchResult(123, Event.CancelHomeGoal, 'AA');
    }).toThrow('Cannot cancel home goal: no \'H\' found to cancel');
  });

  test('should throw exception when trying to cancel with semicolon at beginning', () => {
    expect(() => {
      updateMatchResult(123, Event.CancelHomeGoal, ';HHA');
    }).toThrow('Cannot cancel home goal: semicolon at beginning indicates invalid match state');
  });
});
