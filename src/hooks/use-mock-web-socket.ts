import { useEffect, useRef } from 'react';
import type { Match } from '../features/odds/types';

export function useMockWebSocket(setMatches: React.Dispatch<React.SetStateAction<Match[]>>) {
  const matchesRef = useRef<Match[]>();

  useEffect(() => {
    setMatches(prevMatches => {
      matchesRef.current = prevMatches;
      return prevMatches;
    });
  }, [setMatches]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentMatches = matchesRef.current;
      if (!currentMatches || !currentMatches.length) return;

      const updates = new Map<number, Match>();

      const updateCount = Math.min(currentMatches.length, 25);

      for (let i = 0; i < updateCount; i++) {
        const matchIndex = Math.floor(Math.random() * currentMatches.length);
        
        const matchToUpdate = updates.get(matchIndex) || { ...currentMatches[matchIndex] };

        if (!matchToUpdate.markets || matchToUpdate.markets.length === 0) continue;

        const marketIndex = Math.floor(Math.random() * matchToUpdate.markets.length);
        const marketToUpdate = { ...matchToUpdate.markets[marketIndex] };

        const oddsKeys = Object.keys(marketToUpdate.odds);
        if (oddsKeys.length === 0) continue;
        const oddKey = oddsKeys[Math.floor(Math.random() * oddsKeys.length)];
        
        const oldOdd = marketToUpdate.odds[oddKey];
        if(!oldOdd) continue;
        
        const change = (Math.random() - 0.45) * 0.2; 
        const newValue = Math.max(1.01, oldOdd.value + change);

        const newMarkets = (updates.get(matchIndex)?.markets || currentMatches[matchIndex].markets).map(m => ({ ...m, odds: { ...m.odds } }));

        newMarkets[marketIndex].odds[oddKey] = { value: parseFloat(newValue.toFixed(2)), previousValue: oldOdd.value };
        
        updates.set(matchIndex, { ...matchToUpdate, markets: newMarkets });
      }
      
      if(updates.size > 0) {
        setMatches(prevMatches => {
            const newMatches = [...prevMatches];
            updates.forEach((updatedMatch, index) => {
                newMatches[index] = updatedMatch;
            });
            matchesRef.current = newMatches;
            return newMatches;
        })
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [setMatches]);
}
