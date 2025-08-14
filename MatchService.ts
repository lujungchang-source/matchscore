/**
 * Match Service
 * Provides functionality for querying and updating match results
 */

import { updateMatchResult as updateMatchResultUtil, UpdateMatchResultException } from './MatchResultUpdater';

// Event enum with numeric values
export enum Event {
  HomeGoal = 1,
  AwayGoal = 2,
  CancelHomeGoal = 3,
  CancelAwayGoal = 4,
  NextPeriod = 5,
}

export class MatchService {
  // Private member to store mock match data
  private mockMatchData: string = "HHA;A";

  /**
   * Query match result by match ID
   * @param matchId - The match ID to query
   * @returns A string representation of the match result
   */
  queryMatchResult(matchId: number): string {
    try {
      // TODO: Implement actual API call or database query
      // Raw format: H=Home Goal, A=Away Goal, ;=Second Half marker
      // Example: "HHA;A" means 2 home goals, 1 away goal, in second half
      return this.mockMatchData;
    } catch (error) {
      return `Error querying match ${matchId}: ${error}`;
    }
  }

  /**
   * Update the mock match data (for testing/development purposes)
   * @param newMatchData - New match data string in format H/A/; 
   */
  private setMockMatchData(newMatchData: string): void {
    this.mockMatchData = newMatchData;
  }

  /**
   * Get the current mock match data (for testing/development purposes)
   * @returns Current mock match data string
   */
  private getMockMatchData(): string {
    return this.mockMatchData;
  }

  /**
   * Update match result with an event
   * @param matchId - The match ID to update
   * @param event - The event that occurred (from Event enum)
   * @returns A string representing the result of the update operation
   */
  updateMatchResult(matchId: number, event: Event): string {
    try {
      // Use the utility function for proper business rule handling
      const originalMatchData = this.mockMatchData;
      
      try {
        this.mockMatchData = updateMatchResultUtil(matchId, event, this.mockMatchData);
      } catch (error) {
        // Restore original data if there was an exception
        this.mockMatchData = originalMatchData;
        
        if (error instanceof UpdateMatchResultException) {
          // Return the exception details as requested
          return `Update Match Result Exception, Event: ${error.event}, originalMatchResult: ${error.originalMatchResult}`;
        }
        throw error; // Re-throw if it's not our custom exception
      }
      
      let eventDescription: string;
      
      switch (event) {
        case Event.HomeGoal:
          eventDescription = 'Home team scored a goal';
          break;
        case Event.AwayGoal:
          eventDescription = 'Away team scored a goal';
          break;
        case Event.CancelHomeGoal:
          eventDescription = 'Home team goal cancelled';
          break;
        case Event.CancelAwayGoal:
          eventDescription = 'Away team goal cancelled';
          break;
        case Event.NextPeriod:
          eventDescription = 'Match period updated';
          break;
        default:
          eventDescription = 'Unknown event';
      }

      // Mock successful update
      return `Match ${matchId} updated successfully: ${eventDescription} (Event: ${event})`;
    } catch (error) {
      return `Error updating match ${matchId}: ${error}`;
    }
  }
}

// Export a singleton instance for convenience
export const matchService = new MatchService();
