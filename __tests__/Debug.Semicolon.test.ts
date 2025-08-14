/**
 * Test specific case: ;AAAHHHH Cancel Away Goal
 */

import { updateMatchResult, Event } from '../MatchResultUpdater';

describe('Debug ;AAAHHHH Cancel Away Goal', () => {
  test('should handle ;AAAHHHH Cancel Away Goal', () => {
    const result = updateMatchResult(123, Event.CancelAwayGoal, ';AAAHHHH');
    console.log('Result:', result);
    expect(result).toBe(';AAHHH'); // Should remove the last 'A' -> ';AAHHH'
  });

  test('should understand the logic for ;AAAHHHH', () => {
    // ;AAAHHHH means:
    // - No first half (empty before ;)  
    // - Second half: AAA (3 away goals) + HHHH (4 home goals)
    // CancelAwayGoal should remove the last A from second half
    // Expected: ;AAHHH (2 away goals + 4 home goals in second half)
    
    expect(() => {
      const result = updateMatchResult(123, Event.CancelAwayGoal, ';AAAHHHH');
      console.log('Actual result:', result);
    }).not.toThrow(); // Should not throw an exception
  });
});
