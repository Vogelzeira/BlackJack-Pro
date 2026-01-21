
import { Card, Suit, Rank, CountingSystem, Settings, StrategyAction } from './types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export const CARD_VALUES: Record<Rank, { primary: number, secondary?: number }> = {
    '2': { primary: 2 }, '3': { primary: 3 }, '4': { primary: 4 }, '5': { primary: 5 }, '6': { primary: 6 },
    '7': { primary: 7 }, '8': { primary: 8 }, '9': { primary: 9 }, 'T': { primary: 10 }, 'J': { primary: 10 },
    'Q': { primary: 10 }, 'K': { primary: 10 }, 'A': { primary: 11, secondary: 1 }
};

export const DECK: Card[] = SUITS.flatMap(suit =>
    RANKS.map(rank => ({ suit, rank }))
);

export const COUNTING_SYSTEMS: Record<string, CountingSystem> = {
    'Hi-Lo': {
        name: 'Hi-Lo',
        values: { '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 0, '8': 0, '9': 0, 'T': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1 },
        isBalanced: true,
    },
    'KO': {
        name: 'KO',
        values: { '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 0, '9': 0, 'T': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1 },
        isBalanced: false,
    },
    'Omega II': {
        name: 'Omega II',
        values: { '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1, '8': 0, '9': -1, 'T': -2, 'J': -2, 'Q': -2, 'K': -2, 'A': 0 },
        isBalanced: true,
    }
};

export const INITIAL_SETTINGS: Settings = {
    numberOfDecks: 6,
    countingSystem: 'Hi-Lo',
};

// Basic Strategy Tables
// Dealer's up-card is the column index (2-A)
// Player's hand total is the key
type StrategyTable = Record<number, StrategyAction[]>;

// H: Hit, S: Stand, D: Double
export const BASIC_STRATEGY_HARD: StrategyTable = {
    // 5-8
    8: ['hit', 'hit', 'hit', 'hit', 'hit', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 9
    9: ['hit', 'double', 'double', 'double', 'double', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 10
    10: ['double', 'double', 'double', 'double', 'double', 'double', 'double', 'double', 'hit', 'hit'],
    // 11
    11: ['double', 'double', 'double', 'double', 'double', 'double', 'double', 'double', 'double', 'hit'],
    // 12
    12: ['hit', 'hit', 'stand', 'stand', 'stand', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 13
    13: ['stand', 'stand', 'stand', 'stand', 'stand', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 14
    14: ['stand', 'stand', 'stand', 'stand', 'stand', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 15
    15: ['stand', 'stand', 'stand', 'stand', 'stand', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 16
    16: ['stand', 'stand', 'stand', 'stand', 'stand', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // 17+
    17: ['stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand'],
};

// Soft Totals (with an Ace)
export const BASIC_STRATEGY_SOFT: StrategyTable = {
    // A,2 & A,3
    13: ['hit', 'hit', 'hit', 'double', 'double', 'hit', 'hit', 'hit', 'hit', 'hit'],
    14: ['hit', 'hit', 'hit', 'double', 'double', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // A,4 & A,5
    15: ['hit', 'hit', 'double', 'double', 'double', 'hit', 'hit', 'hit', 'hit', 'hit'],
    16: ['hit', 'hit', 'double', 'double', 'double', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // A,6
    17: ['hit', 'double', 'double', 'double', 'double', 'hit', 'hit', 'hit', 'hit', 'hit'],
    // A,7
    18: ['stand', 'double', 'double', 'double', 'double', 'stand', 'stand', 'hit', 'hit', 'stand'],
    // A,8 & A,9 & A,T
    19: ['stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand'],
    20: ['stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand'],
};

// Pairs
export const BASIC_STRATEGY_SPLIT: Record<string, StrategyAction[]> = {
    'A': ['split', 'split', 'split', 'split', 'split', 'split', 'split', 'split', 'split', 'split'],
    'T': ['stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand', 'stand'],
    '9': ['split', 'split', 'split', 'split', 'split', 'stand', 'split', 'split', 'stand', 'stand'],
    '8': ['split', 'split', 'split', 'split', 'split', 'split', 'split', 'split', 'split', 'split'],
    '7': ['split', 'split', 'split', 'split', 'split', 'split', 'hit', 'hit', 'hit', 'hit'],
    '6': ['split', 'split', 'split', 'split', 'split', 'hit', 'hit', 'hit', 'hit', 'hit'],
    '5': ['double', 'double', 'double', 'double', 'double', 'double', 'double', 'double', 'hit', 'hit'],
    '4': ['hit', 'hit', 'hit', 'split', 'split', 'hit', 'hit', 'hit', 'hit', 'hit'],
    '3': ['split', 'split', 'split', 'split', 'split', 'split', 'hit', 'hit', 'hit', 'hit'],
    '2': ['split', 'split', 'split', 'split', 'split', 'split', 'hit', 'hit', 'hit', 'hit'],
};

// Key deviations from Basic Strategy based on True Count.
// Format: { 'Player Hand vs Dealer Up Card': { threshold: number, action: StrategyAction, direction: 'above' | 'below' } }
// This is a simplified list (Illustrious 18).
export const TRUE_COUNT_DEVIATIONS: Record<string, { threshold: number, action: StrategyAction, reason: string }> = {
    '16vT': { threshold: 0, action: 'stand', reason: 'Stand on 16 vs 10 if TC is 0 or higher.' },
    '15vT': { threshold: 4, action: 'stand', reason: 'Stand on 15 vs 10 if TC is +4 or higher.' },
    '10vT': { threshold: 4, action: 'double', reason: 'Double on 10 vs 10 if TC is +4 or higher.' },
    '12v3': { threshold: 2, action: 'stand', reason: 'Stand on 12 vs 3 if TC is +2 or higher.' },
    '12v2': { threshold: 3, action: 'stand', reason: 'Stand on 12 vs 2 if TC is +3 or higher.' },
    '11vA': { threshold: 1, action: 'double', reason: 'Double on 11 vs Ace if TC is +1 or higher.' },
    '9v2': { threshold: 1, action: 'double', reason: 'Double on 9 vs 2 if TC is +1 or higher.' },
    '10vA': { threshold: 4, action: 'double', reason: 'Double on 10 vs Ace if TC is +4 or higher.' },
    '9v7': { threshold: 3, action: 'double', reason: 'Double on 9 vs 7 if TC is +3 or higher.' },
    '16v9': { threshold: 5, action: 'stand', reason: 'Stand on 16 vs 9 if TC is +5 or higher.' },
    '13v2': { threshold: -1, action: 'stand', reason: 'Stand on 13 vs 2 if TC is -1 or lower.' },
    '12v4': { threshold: 0, action: 'stand', reason: 'Stand on 12 vs 4 if TC is 0 or higher (negative index).' },
    '12v5': { threshold: -2, action: 'stand', reason: 'Stand on 12 vs 5 if TC is -2 or lower.' },
    '12v6': { threshold: -1, action: 'stand', reason: 'Stand on 12 vs 6 if TC is -1 or lower.' },
    '13v3': { threshold: -2, action: 'stand', reason: 'Stand on 13 vs 3 if TC is -2 or lower.' },
    // Insurance
    'insurance': { threshold: 3, action: 'surrender', reason: 'Take insurance if TC is +3 or higher.' }
};
