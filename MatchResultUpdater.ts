/**
 * Match Result Update Utility
 * Handles match result updates with specific business rules
 */

export enum Event {
  HomeGoal = 1,
  AwayGoal = 2,
  CancelHomeGoal = 3,
  CancelAwayGoal = 4,
  NextPeriod = 5,
}

/**
 * Custom exception for match result update errors
 */
export class UpdateMatchResultException extends Error {
  constructor(
    public readonly event: Event,
    public readonly originalMatchResult: string,
    message: string
  ) {
    super(message);
    this.name = 'UpdateMatchResultException';
  }

  toString(): string {
    return `Update Match Result Exception, Event: ${this.event}, originalMatchResult: ${this.originalMatchResult}`;
  }
}

/**
 * Update match result based on event with specific business rules
 * @param matchId - The match ID to update
 * @param event - The event that occurred (from Event enum)
 * @param currentMatchResult - Current match result string
 * @returns Updated match result string
 * @throws UpdateMatchResultException when business rules are violated
 */
export function updateMatchResult(
  matchId: number,
  event: Event,
  currentMatchResult: string
): string {
  let updatedResult = currentMatchResult;

  switch (event) {
    case Event.HomeGoal:
      updatedResult += 'H';
      break;

    case Event.AwayGoal:
      updatedResult += 'A';
      break;

    case Event.CancelHomeGoal:
      updatedResult = cancelHomeGoal(currentMatchResult, event);
      break;

    case Event.CancelAwayGoal:
      updatedResult = cancelAwayGoal(currentMatchResult, event);
      break;

    case Event.NextPeriod:
      if (!currentMatchResult.includes(';')) {
        updatedResult += ';';
      }
      break;

    default:
      throw new UpdateMatchResultException(
        event,
        currentMatchResult,
        `Unknown event: ${event}`
      );
  }

  return updatedResult;
}

/**
 * Handle CancelHomeGoal event with specific business rules
 * @param matchResult - Current match result string
 * @param event - The cancel home goal event
 * @returns Updated match result string with last 'H' removed
 * @throws UpdateMatchResultException when no 'H' can be cancelled or business rules violated
 */
function cancelHomeGoal(matchResult: string, event: Event): string {
  if (!matchResult) {
    throw new UpdateMatchResultException(
      event,
      matchResult,
      'Cannot cancel home goal: no match data available'
    );
  }

  const semicolonIndex = matchResult.indexOf(';');
  let lastHIndex = -1;
  
  if (semicolonIndex === -1) {
    // No semicolon found - we're in first half, find the last 'H'
    for (let i = matchResult.length - 1; i >= 0; i--) {
      if (matchResult[i] === 'H') {
        lastHIndex = i;
        break;
      }
    }
  } else {
    // Semicolon found - we're in second half, find the last 'H' in second half
    for (let i = matchResult.length - 1; i > semicolonIndex; i--) {
      if (matchResult[i] === 'H') {
        lastHIndex = i;
        break;
      }
    }
    
    // If no 'H' found in second half, check if last char before ';' is 'H'
    if (lastHIndex === -1 && semicolonIndex > 0 && matchResult[semicolonIndex - 1] === 'H') {
      lastHIndex = semicolonIndex - 1;
    }
  }

  if (lastHIndex === -1) {
    throw new UpdateMatchResultException(
      event,
      matchResult,
      'Cannot cancel home goal: no \'H\' found to cancel'
    );
  }

  // Remove the 'H' at lastHIndex
  return matchResult.substring(0, lastHIndex) + matchResult.substring(lastHIndex + 1);
}

/**
 * Handle CancelAwayGoal event with similar logic for 'A'
 * @param matchResult - Current match result string
 * @param event - The cancel away goal event
 * @returns Updated match result string with last 'A' removed
 * @throws UpdateMatchResultException when no 'A' can be cancelled
 */
function cancelAwayGoal(matchResult: string, event: Event): string {
  if (!matchResult) {
    throw new UpdateMatchResultException(
      event,
      matchResult,
      'Cannot cancel away goal: no match data available'
    );
  }

  const semicolonIndex = matchResult.indexOf(';');
  let lastAIndex = -1;
  
  if (semicolonIndex === -1) {
    // No semicolon found - we're in first half, find the last 'A'
    for (let i = matchResult.length - 1; i >= 0; i--) {
      if (matchResult[i] === 'A') {
        lastAIndex = i;
        break;
      }
    }
  } else {
    // Semicolon found - we're in second half, find the last 'A' in second half
    for (let i = matchResult.length - 1; i > semicolonIndex; i--) {
      if (matchResult[i] === 'A') {
        lastAIndex = i;
        break;
      }
    }
    
    // If no 'A' found in second half, check if last char before ';' is 'A'
    if (lastAIndex === -1 && semicolonIndex > 0 && matchResult[semicolonIndex - 1] === 'A') {
      lastAIndex = semicolonIndex - 1;
    }
  }

  if (lastAIndex === -1) {
    throw new UpdateMatchResultException(
      event,
      matchResult,
      'Cannot cancel away goal: no \'A\' found to cancel'
    );
  }

  // Remove the 'A' at lastAIndex
  return matchResult.substring(0, lastAIndex) + matchResult.substring(lastAIndex + 1);
}
