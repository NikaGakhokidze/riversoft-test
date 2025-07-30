import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { format } from 'date-fns';
import { getMockMatches } from '../lib/mock-data';
import { useMockWebSocket } from '../hooks/use-mock-web-socket';
import { useOddsStore } from '../features/odds/store/use-odds-store';
import { cn } from '@/lib/utils';
import type { Match, Odd, Sport } from '../features/odds/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const initialMatches = getMockMatches();
const sports: Sport[] = ['Football', 'Basketball', 'Tennis', 'Ice Hockey', 'Baseball', 'Volleyball', 'Handball'];

const SportIcon = ({ sport }: { sport: Match['sport'] }) => {
  const emoji = useMemo(() => {
    switch (sport) {
      case 'Football':
        return "⚽";
      case 'Basketball':
        return "🏀";
        case 'Tennis':
          return "🎾";
      case 'Ice Hockey':
        return "🏒";
      case 'Baseball':
        return "⚾";
      case 'Volleyball':
        return "🏐";
      default:
        return "🎾";
    }
  }, [sport]);

  return <span className="text-2xl">{emoji}</span>;
};

const OddsCell = React.memo(({ label, oddId, odd, onSelect, isSelected }: { label?: string; oddId: string; odd: Odd; onSelect: (id: string) => void; isSelected: boolean }) => {
  const [highlight, setHighlight] = useState<'increased' | 'decreased' | null>(null);
  const prevValueRef = useRef<number>();
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }

    if (typeof prevValueRef.current !== 'undefined' && odd.value !== prevValueRef.current) {
      setHighlight(odd.value > prevValueRef.current ? 'increased' : 'decreased');
      
      highlightTimerRef.current = setTimeout(() => {
        setHighlight(null);
        highlightTimerRef.current = null;
      }, 1000);
    }
    
    prevValueRef.current = odd.value;

    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, [odd.value]);
  
  return (
    <button
      onClick={() => onSelect(oddId)}
      className={cn(
        "flex h-10 w-15 flex-col items-center justify-center rounded-md p-1 text-xs font-semibold transition-all duration-300",
        isSelected ? 'bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/80',
        highlight === 'increased' && '!bg-green-500/30 text-green-100',
        highlight === 'decreased' && '!bg-red-500/30 text-red-100'
      )}
    >
      {label && <span className="text-muted-foreground">{label}</span>}
      <span>{odd.value.toFixed(2)}</span>
    </button>
  );
});
OddsCell.displayName = 'OddsCell';


const Row = React.memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: any }) => {
  const match: Match = data.matches[index];
  const { selectedOdds, toggleOdd, refreshOdds } = data;
  
  const renderMarket = (marketName: string, keys: {key:string, label:string}[], gridCols: number) => {
      const market = match.markets.find(m => m.name === marketName);
      if (!market) return <div className={cn("grid gap-1", gridCols === 2 ? 'grid-cols-2' : 'grid-cols-3')}>{Array.from({length: keys.length}).map((_, i) => <div key={i} className="h-10 w-20" />)}</div>

      return (
        <div className={cn(`grid gap-1`, gridCols === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
            {keys.map(({key, label}) => {
              const odd = market.odds[key];
              
                if (!odd) return <div key={key} className="h-10 w-20" />;
                const oddId = `${match.id}-${market.name}-${key}`;
                return <OddsCell key={oddId} label={label} oddId={oddId} odd={odd} onSelect={toggleOdd} isSelected={selectedOdds.has(oddId)} />;
            })}
        </div>
      );
  };

  return (
    <div style={style} className="flex items-center border-b px-4 text-sm transition-colors hover:bg-muted/20">
      <div className="grid w-full grid-cols-12 items-center gap-4">
        <div className="col-span-1 flex justify-center">
          <SportIcon sport={match.sport} />
        </div>
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <p className="font-bold">{match.competitors[0]}</p> 
            <span className="rounded-sm bg-destructive/80 px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">LIVE</span>
          </div>
          <p className="font-bold">{match.competitors[1]}</p>
        </div>
        <div className="col-span-1 text-center">
            <p className="text-lg font-bold">{match.score}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(match.startTime), 'HH:mm')}</p>
        </div>
        <div className="col-span-6">
            <div className="grid grid-cols-3 gap-4">
                {renderMarket('1X2', [{key:'1', label:'1'}, {key:'X', label:'X'}, {key:'2', label:'2'}], 3)}
                {renderMarket('Double Chance', [{key:'1X', label:'1X'}, {key:'12', label:'12'}, {key:'X2', label:'X2'}], 3)}
                {renderMarket('Total', [{key:'Over 2.5', label:'Over'}, {key:'Under 2.5', label:'Under'}], 2)}
            </div>
        </div>
        <div className="col-span-1 flex justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => refreshOdds(match.id)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
Row.displayName = 'Row';

const SCROLL_POSITION_KEY = 'odds-board-scroll-position';

export function OddsBoard() {
  const listRef = useRef<List>(null);
  const [liveMatches, setLiveMatches] = useState(initialMatches);
  const [isListReady, setIsListReady] = useState(false);
  const [scrollRestored, setScrollRestored] = useState(false);
  useMockWebSocket(setLiveMatches);
  const { selectedOdds, toggleOdd, isInitialized } = useOddsStore();
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');

  const hasSavedPosition = useMemo(() => {
    try {
      return localStorage.getItem(SCROLL_POSITION_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (isInitialized && isListReady && listRef.current) {
      if (hasSavedPosition) {
        const timer = setTimeout(() => {
          try {
            const savedPosition = localStorage.getItem(SCROLL_POSITION_KEY);
            if (savedPosition) {
              listRef.current?.scrollTo(Number(savedPosition));
            }
          } catch (error) {
            console.error("Failed to restore scroll position:", error);
          }
          setScrollRestored(true);
        }, 50);

        return () => clearTimeout(timer);
      } else {
        setScrollRestored(true);
      }
    }
  }, [isInitialized, isListReady, hasSavedPosition]);

  useEffect(() => {
    if (listRef.current && liveMatches.length > 0) {
      setIsListReady(true);
    }
  }, [liveMatches.length]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);


  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const onScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(SCROLL_POSITION_KEY, String(scrollOffset));
      } catch (error) {
        console.error("Failed to save scroll position:", error);
      }
    }, 100);
  }, []);

  const refreshOdds = useCallback((matchId: string) => {
    setLiveMatches(prevMatches => {
      const matchIndex = prevMatches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prevMatches;

      const newMatches = [...prevMatches];
      const matchToUpdate = { ...newMatches[matchIndex] };

      matchToUpdate.markets = matchToUpdate.markets.map(market => {
        const newOdds: { [key: string]: Odd } = {};
        for (const key in market.odds) {
          const oldOdd = market.odds[key];
          const change = (Math.random() - 0.45) * 0.2;
          const newValue = Math.max(1.01, oldOdd.value + change);
          newOdds[key] = { value: parseFloat(newValue.toFixed(2)), previousValue: oldOdd.value };
        }
        return { ...market, odds: newOdds };
      });
      
      newMatches[matchIndex] = matchToUpdate;
      return newMatches;
    });
  }, []);
  
  const filteredMatches = useMemo(() => {
    if (selectedSport === 'All') {
      return liveMatches;
    }
    return liveMatches.filter(match => match.sport === selectedSport);
  }, [liveMatches, selectedSport]);

  const itemData = useMemo(() => ({
    matches: filteredMatches,
    selectedOdds,
    toggleOdd,
    refreshOdds
  }), [filteredMatches, selectedOdds, toggleOdd, refreshOdds]);

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm h-[79vh]">
        <Tabs defaultValue="All" onValueChange={(value) => setSelectedSport(value as Sport | 'All')}>
            <div className="flex items-center space-x-4 p-4">
                <p className="text-sm font-semibold text-muted-foreground">Filter by Sport:</p>
                <TabsList>
                    <TabsTrigger value="All" className="flex items-center gap-2"><Trophy className="size-4" />All Sports</TabsTrigger>
                    {sports.map(sport => (
                        <TabsTrigger key={sport} value={sport} className="flex items-center gap-2">
                           <SportIcon sport={sport} />
                           {sport}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <div className="hidden grid-cols-12 gap-4 border-y bg-secondary/30 p-4 text-xs font-bold uppercase text-muted-foreground lg:grid">
                <div className="col-span-1 text-center">Sport</div>
                <div className="col-span-3">Match</div>
                <div className="col-span-1 text-center">Time</div>
                <div className="col-span-2 text-center">Match Winner (1X2)</div>
                <div className="col-span-2 text-center">Double Chance</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-right">Refresh</div>
            </div>
            <div className={cn("transition-opacity duration-200", scrollRestored ? "opacity-100" : "opacity-0")}>
                <List
                    ref={listRef}
                    height={600}
                    itemCount={filteredMatches.length}
                    itemSize={72}
                    width="100%"
                    itemData={itemData}
                    onScroll={onScroll}
                    onItemsRendered={() => {
                      // Ensure list is marked as ready when items are rendered
                      if (!isListReady) {
                        setIsListReady(true);
                      }
                    }}
                >
                    {Row}
                </List>
            </div>
        </Tabs>
        <div className="flex items-center justify-between border-t p-3 text-sm text-muted-foreground">
            <p>Real-time odds updates • {filteredMatches.length} matches displayed</p>
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Live updates active
            </div>
        </div>
    </div>
  );
}
