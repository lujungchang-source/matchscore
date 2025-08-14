/**
 * Custom hook for match-related functionality
 */

import { useState, useCallback } from 'react';
import { matchViewModel } from './MatchViewModel';
import { Event } from './MatchService';

export const useMatchHook = () => {
  const [matchResult, setMatchResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateResult, setUpdateResult] = useState<string>('');

  const queryMatch = useCallback(async (matchId: number) => {
    setIsLoading(true);
    try {
      const result = await matchViewModel.queryMatchResult(matchId);
      setMatchResult(result);
    } catch (error) {
      setMatchResult(`Hook Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMatch = useCallback(async (matchId: number, event: Event) => {
    setIsLoading(true);
    try {
      const result = await matchViewModel.updateMatchResult(matchId, event);
      setUpdateResult(result);
      // After update, query the latest match result
      await queryMatch(matchId);
    } catch (error) {
      setUpdateResult(`Hook Update Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [queryMatch]);

  return {
    matchResult,
    isLoading,
    updateResult,
    queryMatch,
    updateMatch,
  };
};
