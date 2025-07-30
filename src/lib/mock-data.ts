
import type { Match, Sport } from '../features/odds/types';
import mockMatchesData from './mock-matches.json';

interface MatchData {
  id: string;
  sport: Sport;
  competitors: string[];
  startTime: string;
  score: string;
  markets: {
    name: string;
    odds: { [key: string]: { value: number } };
  }[];
}

const baseMatches = (mockMatchesData as MatchData[]).map(match => ({
  ...match,
  competitors: [match.competitors[0], match.competitors[1]] as [string, string],
  startTime: new Date(match.startTime)
})) as Match[];

function generateMatches(): Match[] {
  const totalNeeded = 10000;
  const generated: Match[] = [];

  for (let i = 0; i < totalNeeded; i++) {
    const baseMatch = baseMatches[i % baseMatches.length];
    
    const newMatch = JSON.parse(JSON.stringify(baseMatch));

    newMatch.id = `match-${i + 1}`; 
    
    const baseTime = new Date('2024-08-12T00:00:00.000Z');
    baseTime.setMinutes(baseTime.getMinutes() + i * 5); 
    newMatch.startTime = baseTime.toISOString();
    
    generated.push(newMatch);
  }

  return generated;
}

let mockMatches: Match[] | null = null;

export function getMockMatches(): Match[] {
    if (mockMatches) {
        return mockMatches.map(match => ({
            ...match,
            startTime: new Date(match.startTime)
        }));
    }
    
    mockMatches = generateMatches().map(match => ({
        ...match,
        startTime: new Date(match.startTime)
    }));

    return mockMatches;
}
