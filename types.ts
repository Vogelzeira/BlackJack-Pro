
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type Hand = Card[];

export type GameState = 'betting' | 'playerTurn' | 'dealerTurn' | 'endOfHand';
export type PlayerAction = 'hit' | 'stand' | 'double' | 'split';
export type StrategyAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender';

export type CountingSystemName = 'Hi-Lo' | 'KO' | 'Omega II';

export interface CountingSystem {
  name: CountingSystemName;
  values: Record<Rank, number>;
  isBalanced: boolean;
}

export interface Settings {
    numberOfDecks: 1 | 2 | 4 | 6 | 8;
    countingSystem: CountingSystemName;
}

export type HandResultType = 'player_win' | 'dealer_win' | 'push' | 'player_blackjack';

export interface HandResult {
    playerHand: Hand;
    dealerHand: Hand;
    result: HandResultType;
    playerAction?: PlayerAction;
    recommendedAction?: StrategyAction | { action: StrategyAction; reason: string; };
}

export interface HandValue {
    total: number;
    soft: boolean;
}

export type HandStatus = 'active' | 'bust' | 'blackjack' | 'charlie';

export interface StrategyDecision {
    action: StrategyAction;
    reason: string;
}

export interface AIAnalysisRequest {
    playerHand: Hand;
    dealerUpCard: Card;
    trueCount: number;
    playerAction: PlayerAction;
    recommendedAction: StrategyAction;
}
