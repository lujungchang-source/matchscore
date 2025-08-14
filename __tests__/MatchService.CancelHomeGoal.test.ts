/**
 * Tests for MatchService CancelHomeGoal functionality
 */

import { MatchService, Event } from '../MatchService';

describe('MatchService - Cancel Home Goal', () => {
  let matchService: MatchService;

  beforeEach(() => {
    matchService = new MatchService();
    // Reset to initial state
    (matchService as any).mockMatchData = "HHA;A";
  });

  describe('CancelHomeGoal event', () => {
    test('should successfully cancel last home goal - normal case', () => {
      // Set mock data to have home goals that can be cancelled
      (matchService as any).mockMatchData = "HHA";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('HA');
    });

    test('should successfully cancel home goal before semicolon', () => {
      // Set mock data where H is right before ;
      (matchService as any).mockMatchData = "HAH;";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('HA;');
    });

    test('should successfully cancel home goal when H is before semicolon with content after', () => {
      // Set mock data where H is before ; with more content
      (matchService as any).mockMatchData = "HAAH;A";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('HAA;A');
    });

    test('should return exception when trying to cancel H but last char before ; is not H', () => {
      // Set mock data where A is before ;
      (matchService as any).mockMatchData = "HHA;A";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Update Match Result Exception');
      expect(result).toContain('Event: 3');
      expect(result).toContain('originalMatchResult: HHA;A');
      // Original data should remain unchanged when exception occurs
      expect((matchService as any).mockMatchData).toBe('HHA;A');
    });

    test('should return exception when no H exists to cancel', () => {
      // Set mock data with no H
      (matchService as any).mockMatchData = "AA";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Update Match Result Exception');
      expect(result).toContain('Event: 3');
      expect(result).toContain('originalMatchResult: AA');
      // Original data should remain unchanged
      expect((matchService as any).mockMatchData).toBe('AA');
    });

    test('should handle semicolon at beginning - should work normally', () => {
      // Set mock data with ; at beginning - should work since last char is not ;
      (matchService as any).mockMatchData = ";HHA";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      // Should remove the last H, resulting in ";HA"
      expect((matchService as any).mockMatchData).toBe(';HA');
    });

    test('should return exception when last character is semicolon and previous is not H', () => {
      // Set mock data where last char is ; and previous is A
      (matchService as any).mockMatchData = "HHAA;";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Update Match Result Exception');
      expect(result).toContain('Event: 3');
      expect(result).toContain('originalMatchResult: HHAA;');
      // Original data should remain unchanged when exception occurs
      expect((matchService as any).mockMatchData).toBe('HHAA;');
    });

    test('should handle empty match data', () => {
      // Set empty mock data
      (matchService as any).mockMatchData = "";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Update Match Result Exception');
      expect(result).toContain('Event: 3');
      expect(result).toContain('originalMatchResult: ');
    });
  });

  describe('Integration test - realistic match scenario', () => {
    test('should handle match progression with cancellations', () => {
      // Start fresh
      (matchService as any).mockMatchData = "";
      
      // Home scores
      let result = matchService.updateMatchResult(123, Event.HomeGoal);
      expect(result).toContain('Home team scored a goal');
      expect((matchService as any).mockMatchData).toBe('H');
      
      // Home scores again
      result = matchService.updateMatchResult(123, Event.HomeGoal);
      expect((matchService as any).mockMatchData).toBe('HH');
      
      // Away scores
      result = matchService.updateMatchResult(123, Event.AwayGoal);
      expect((matchService as any).mockMatchData).toBe('HHA');
      
      // Cancel home goal - should work
      result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('HA');
      
      // Second half starts
      result = matchService.updateMatchResult(123, Event.NextPeriod);
      expect((matchService as any).mockMatchData).toBe('HA;');
      
      // Try to cancel home goal - should fail because A is before ;
      result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      expect(result).toContain('Update Match Result Exception');
      expect((matchService as any).mockMatchData).toBe('HA;'); // Should remain unchanged
      
      // Home scores in second half
      result = matchService.updateMatchResult(123, Event.HomeGoal);
      expect((matchService as any).mockMatchData).toBe('HA;H');
      
      // Now cancel home goal should work (removes the H after ;)
      result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('HA;');
    });
  });

  describe('Edge cases', () => {
    test('should handle multiple H before semicolon', () => {
      (matchService as any).mockMatchData = "AHHH;A";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('AHH;A');
    });

    test('should handle H at very end after semicolon', () => {
      (matchService as any).mockMatchData = "AA;H";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('AA;');
    });

    test('should prioritize last H over H before semicolon', () => {
      (matchService as any).mockMatchData = "H;H";
      
      const result = matchService.updateMatchResult(123, Event.CancelHomeGoal);
      
      expect(result).toContain('Home team goal cancelled');
      expect((matchService as any).mockMatchData).toBe('H;');
    });
  });
});
