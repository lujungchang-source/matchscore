/**
 * Match Result Parser Utility
 * Utility functions for parsing match result strings
 */

/**
 * Parse match result string and convert to display format
 * @param matchResult - Raw match result string containing H, A, and ; characters
 * @returns Formatted display string in format "HomeGoal:AwayGoal (First/Second Half)"
 * 
 * @example
 * parseMatchResultToDisplay('HH') // Returns: "2:0 (First Half)"
 * parseMatchResultToDisplay('HHA;A') // Returns: "2:2 (Second Half)"
 * parseMatchResultToDisplay('') // Returns: "0:0 (First Half)"
 */
export function parseMatchResultToDisplay(matchResult: string): string {
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
        default:
          // Ignore invalid characters
          break;
      }
    }

    const half = isSecondHalf ? 'Second Half' : 'First Half';
    return `${homeGoals}:${awayGoals} (${half})`;
  } catch (error) {
    // Return default fallback on error
    return '0:0 (First Half)';
  }
}

/**
 * Validate if a match result string contains only valid characters
 * @param matchResult - Raw match result string to validate
 * @returns True if string contains only H, A, and ; characters
 */
export function isValidMatchResult(matchResult: string): boolean {
  const validPattern = /^[HA;]*$/;
  return validPattern.test(matchResult);
}

/**
 * Get match statistics from result string
 * @param matchResult - Raw match result string
 * @returns Object containing detailed match statistics
 */
export function getMatchStatistics(matchResult: string): {
  homeGoals: number;
  awayGoals: number;
  totalGoals: number;
  isSecondHalf: boolean;
  displayResult: string;
} {
  try {
    let homeGoals = 0;
    let awayGoals = 0;
    let isSecondHalf = false;

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

    return {
      homeGoals,
      awayGoals,
      totalGoals: homeGoals + awayGoals,
      isSecondHalf,
      displayResult: parseMatchResultToDisplay(matchResult),
    };
  } catch (error) {
    return {
      homeGoals: 0,
      awayGoals: 0,
      totalGoals: 0,
      isSecondHalf: false,
      displayResult: '0:0 (First Half)',
    };
  }
}
