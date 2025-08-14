/**
 * Tests for MatchResultUpdater
 */

import { 
  updateMatchResult, 
  Event, 
  UpdateMatchResultException 
} from '../MatchResultUpdater';

describe('MatchResultUpdater', () => {
  describe('updateMatchResult', () => {
    describe('CancelHomeGoal event', () => {
      test('should remove last H from match result', () => {
        const result = updateMatchResult(123, Event.CancelHomeGoal, 'HHA');
        expect(result).toBe('HA');
      });

      test('should remove last H when multiple H exist', () => {
        const result = updateMatchResult(123, Event.CancelHomeGoal, 'HHHA');
        expect(result).toBe('HHA');
      });

      test('should remove H before semicolon when H is right before semicolon', () => {
        const result = updateMatchResult(123, Event.CancelHomeGoal, 'HAH;');
        expect(result).toBe('HA;');
      });

      test('should remove H when H is right before semicolon with content after', () => {
        const result = updateMatchResult(123, Event.CancelHomeGoal, 'HAAH;A');
        expect(result).toBe('HAA;A');
      });

      test('should throw exception when last character is semicolon and previous is not H', () => {
        expect(() => {
          updateMatchResult(123, Event.CancelHomeGoal, 'HHA;');
        }).toThrow(UpdateMatchResultException);
        
        expect(() => {
          updateMatchResult(123, Event.CancelHomeGoal, 'HHA;A');
        }).toThrow(UpdateMatchResultException);
      });

      test('should throw exception when no H exists', () => {
        expect(() => {
          updateMatchResult(123, Event.CancelHomeGoal, 'AA');
        }).toThrow(UpdateMatchResultException);
      });

      test('should throw exception with correct error details', () => {
        try {
          updateMatchResult(123, Event.CancelHomeGoal, 'AA');
        } catch (error: any) {
          expect(error).toBeInstanceOf(UpdateMatchResultException);
          expect((error as UpdateMatchResultException).event).toBe(Event.CancelHomeGoal);
          expect((error as UpdateMatchResultException).originalMatchResult).toBe('AA');
          expect((error as UpdateMatchResultException).toString()).toContain('Event: 3');
          expect((error as UpdateMatchResultException).toString()).toContain('originalMatchResult: AA');
        }
      });

      test('should throw exception when match result is empty', () => {
        expect(() => {
          updateMatchResult(123, Event.CancelHomeGoal, '');
        }).toThrow(UpdateMatchResultException);
      });

      test('should handle semicolon at beginning by finding H before it', () => {
        // When semicolon is at beginning, the function should continue searching for H
        const result = updateMatchResult(123, Event.CancelHomeGoal, ';HHA');
        expect(result).toBe(';HA');
      });
    });

    describe('CancelAwayGoal event', () => {
      test('should remove last A from match result', () => {
        const result = updateMatchResult(123, Event.CancelAwayGoal, 'HHA');
        expect(result).toBe('HH');
      });

      test('should remove A before semicolon when A is right before semicolon', () => {
        const result = updateMatchResult(123, Event.CancelAwayGoal, 'HHA;');
        expect(result).toBe('HH;');
      });

      test('should throw exception when encountering semicolon and previous character is not A', () => {
        expect(() => {
          updateMatchResult(123, Event.CancelAwayGoal, 'HHAH;H');
        }).toThrow(UpdateMatchResultException);
      });
    });

    describe('Other events', () => {
      test('should add H for HomeGoal event', () => {
        const result = updateMatchResult(123, Event.HomeGoal, 'HHA');
        expect(result).toBe('HHAH');
      });

      test('should add A for AwayGoal event', () => {
        const result = updateMatchResult(123, Event.AwayGoal, 'HHA');
        expect(result).toBe('HHAA');
      });

      test('should add semicolon for NextPeriod event', () => {
        const result = updateMatchResult(123, Event.NextPeriod, 'HHA');
        expect(result).toBe('HHA;');
      });

      test('should not add semicolon if already exists', () => {
        const result = updateMatchResult(123, Event.NextPeriod, 'HHA;A');
        expect(result).toBe('HHA;A');
      });

      test('should throw exception for unknown event', () => {
        expect(() => {
          updateMatchResult(123, 999 as Event, 'HHA');
        }).toThrow(UpdateMatchResultException);
      });
    });

    describe('Complex scenarios', () => {
      test('should handle realistic match progression with cancellations', () => {
        let matchResult = '';
        
        // Home scores
        matchResult = updateMatchResult(123, Event.HomeGoal, matchResult);
        expect(matchResult).toBe('H');
        
        // Home scores again
        matchResult = updateMatchResult(123, Event.HomeGoal, matchResult);
        expect(matchResult).toBe('HH');
        
        // Away scores
        matchResult = updateMatchResult(123, Event.AwayGoal, matchResult);
        expect(matchResult).toBe('HHA');
        
        // Cancel home goal
        matchResult = updateMatchResult(123, Event.CancelHomeGoal, matchResult);
        expect(matchResult).toBe('HA');
        
        // Second half starts
        matchResult = updateMatchResult(123, Event.NextPeriod, matchResult);
        expect(matchResult).toBe('HA;');
        
        // Away scores in second half
        matchResult = updateMatchResult(123, Event.AwayGoal, matchResult);
        expect(matchResult).toBe('HA;A');
        
        // Cancel away goal (should remove the A after semicolon)
        matchResult = updateMatchResult(123, Event.CancelAwayGoal, matchResult);
        expect(matchResult).toBe('HA;');
      });

      test('should handle edge case with multiple semicolons in search', () => {
        // This tests that we only look at the first semicolon encountered from the right
        const result = updateMatchResult(123, Event.CancelHomeGoal, 'H;A;H');
        expect(result).toBe('H;A;');
      });
    });
  });

  describe('UpdateMatchResultException', () => {
    test('should create exception with correct properties', () => {
      const exception = new UpdateMatchResultException(
        Event.CancelHomeGoal,
        'HHA;A',
        'Test error message'
      );
      
      expect(exception.event).toBe(Event.CancelHomeGoal);
      expect(exception.originalMatchResult).toBe('HHA;A');
      expect(exception.message).toBe('Test error message');
      expect(exception.name).toBe('UpdateMatchResultException');
    });

    test('should have correct toString format', () => {
      const exception = new UpdateMatchResultException(
        Event.CancelHomeGoal,
        'HHA;A',
        'Test error'
      );
      
      const result = exception.toString();
      expect(result).toBe('Update Match Result Exception, Event: 3, originalMatchResult: HHA;A');
    });
  });
});
