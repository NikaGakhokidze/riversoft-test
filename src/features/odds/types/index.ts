export type Sport = 'Football' | 'Basketball' | 'Tennis' | 'Ice Hockey' | 'Baseball' | 'Volleyball' | 'Handball';

export interface Odd {
  value: number;
  previousValue?: number;
}

export interface Market {
  name: '1X2' | 'Double Chance' | 'Total';
  odds: { [key: string]: Odd };
}

export interface Match {
  id: string;
  sport: Sport;
  competitors: [string, string];
  startTime: Date;
  score: string;
  markets: Market[];
}
