/**
 * Match View Model
 * Handles the presentation logic for match-related UI components
 */

import { matchService } from './MatchService';

export class MatchViewModel {
  /**
   * Parse match result string and convert to display format
   * @param matchResult - Raw match result string containing H, A, and ; characters
   * @returns Formatted display string in format "HomeGoal:AwayGoal (First/Second Half)"
   */
  private parseMatchResultToDisplay(matchResult: string): string {
    try {
      let homeGoals = 0;
      let awayGoals = 0;
      let isSecondHalf = false;

      // Count occurrences and check for second half marker
      for (let i = 0; i < matchResult.length; i++) {
        const char = matchResult[i];
        switch (char) {
          case 'H':
            homeGoals++;
            break;
          case 'A':
            awayGoals++;
            break;
          case ';':
            isSecondHalf = true;
            break;
        }
      }

      const half = isSecondHalf ? 'Second Half' : 'First Half';
      return `${homeGoals}:${awayGoals} (${half})`;
    } catch (error) {
      return '0:0 (First Half)'; // Default fallback
    }
  }

  /**
   * Query match result using the match service
   * @param matchId - The match ID to query
   * @returns Promise with formatted match result string
   */
  async queryMatchResult(matchId: number): Promise<string> {
    try {
      const result = matchService.queryMatchResult(matchId);
      
      // Parse the raw result to display format
      const displayResult = this.parseMatchResultToDisplay(result);
      return displayResult;
    } catch (error) {
      return `Error in ViewModel: ${error}`;
    }
  }

  /**
   * Update match result using the match service
   * @param matchId - The match ID to update
   * @param event - The event that occurred
   * @returns Promise with update result string
   */
  async updateMatchResult(matchId: number, event: import('./MatchService').Event): Promise<string> {
    try {
      const result = matchService.updateMatchResult(matchId, event);
      return result;
    } catch (error) {
      return `Error in ViewModel update: ${error}`;
    }
  }
}

// Export a singleton instance for convenience
export const matchViewModel = new MatchViewModel();
