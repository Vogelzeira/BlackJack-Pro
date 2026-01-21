
import { Hand, Card, StrategyAction, StrategyDecision } from '../types';
import { getHandValue, isSoft } from './gameLogic';
import { BASIC_STRATEGY_HARD, BASIC_STRATEGY_SOFT, BASIC_STRATEGY_SPLIT, TRUE_COUNT_DEVIATIONS } from '../constants';

const DEALER_CARD_INDEX: Record<string, number> = { '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, 'T': 8, 'J': 8, 'Q': 8, 'K': 8, 'A': 9 };

/**
 * Determines the optimal action for a given hand against a dealer's up-card.
 * This function considers basic strategy and applies deviations based on the true count.
 * @param playerHand - The player's current hand.
 * @param dealerUpCard - The dealer's visible card.
 * @param trueCount - The current true count.
 * @param numberOfDecks - The total number of decks in the game.
 * @returns An object containing the recommended action and the reason.
 */
export const getOptimalAction = (playerHand: Hand, dealerUpCard: Card, trueCount: number, numberOfDecks: number): StrategyDecision => {
    const playerValue = getHandValue(playerHand);
    const dealerIndex = DEALER_CARD_INDEX[dealerUpCard.rank];

    // Check for deviations first, as they override basic strategy
    const deviationKey = `${playerValue.total}v${dealerUpCard.rank}`;
    if (TRUE_COUNT_DEVIATIONS[deviationKey] && trueCount >= TRUE_COUNT_DEVIATIONS[deviationKey].threshold) {
        const dev = TRUE_COUNT_DEVIATIONS[deviationKey];
        return { action: dev.action, reason: `High True Count Deviation: ${dev.reason}` };
    }

    // Check for pairs to split
    if (playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank) {
        const pairRank = playerHand[0].rank;
        const action = BASIC_STRATEGY_SPLIT[pairRank][dealerIndex];
        // We are simplifying and not implementing split logic in the game itself,
        // but the recommendation engine should still suggest it.
        // If split is not available, we need a fallback.
        if (action === 'split') {
            return { action: 'split', reason: `Basic Strategy: Splitting ${pairRank}s against a dealer's ${dealerUpCard.rank} is the highest EV play.`};
        }
    }
    
    // Check for soft hands
    if (isSoft(playerHand)) {
        let action: StrategyAction | undefined;
        // Iterate down from player total to find the correct strategy row
        for (let i = playerValue.total; i >= 13; i--) {
            if (BASIC_STRATEGY_SOFT[i]) {
                action = BASIC_STRATEGY_SOFT[i][dealerIndex];
                break;
            }
        }
        if (action) {
             // Can't double on more than 2 cards
            if (action === 'double' && playerHand.length > 2) {
                return { action: 'hit', reason: `Basic Strategy (Soft Hand): You can no longer double, so hit.` };
            }
            return { action, reason: `Basic Strategy: With a soft ${playerValue.total} against a ${dealerUpCard.rank}, the best action is to ${action}.` };
        }
    }

    // Hard totals
    let action: StrategyAction | undefined;
    if (playerValue.total >= 17) action = 'stand';
    else if (playerValue.total <= 8) action = 'hit';
    else {
        // Iterate down from player total
        for (let i = playerValue.total; i >= 9; i--) {
            if (BASIC_STRATEGY_HARD[i]) {
                action = BASIC_STRATEGY_HARD[i][dealerIndex];
                break;
            }
        }
    }

    if (action) {
         // Can't double on more than 2 cards
        if (action === 'double' && playerHand.length > 2) {
             return { action: 'hit', reason: `Basic Strategy (Hard Hand): You can no longer double, so hit.` };
        }
        return { action, reason: `Basic Strategy: With a hard ${playerValue.total} against a ${dealerUpCard.rank}, the best action is to ${action}.` };
    }

    // Default fallback
    return { action: 'stand', reason: 'Fell through strategy logic, defaulting to stand.'};
};
