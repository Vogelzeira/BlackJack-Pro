
import { Hand, Card, PlayerAction } from '../types';
import { getHandValue } from './gameLogic';
import { CARD_VALUES, RANKS } from '../constants';

/**
 * Calculates the probability of busting if the player hits.
 * This is a crucial piece of information for decision making.
 * @param playerHand - The player's current hand.
 * @param remainingShoe - The array of cards left in the shoe.
 * @returns The probability (0 to 1) of busting on the next card.
 */
export const calculateBustProbability = (playerHand: Hand, remainingShoe: Card[]): number => {
    const { total } = getHandValue(playerHand);
    if (total > 21) return 1;

    const cardsToBust = 21 - total;
    if (cardsToBust < 2) return 1; // Any card of 2 or more will bust

    let bustingCardCount = 0;
    for (const card of remainingShoe) {
        if (CARD_VALUES[card.rank].primary > cardsToBust) {
            bustingCardCount++;
        }
    }

    return remainingShoe.length > 0 ? bustingCardCount / remainingShoe.length : 0;
};


/**
 * Calculates a simplified Expected Value (EV) for an action.
 * NOTE: A full EV calculation is extremely complex and involves simulating all possible outcomes.
 * This version provides a simplified, educational estimate based on immediate outcomes.
 * It considers the chance of improving vs. busting for 'hit', and compares current standing value against dealer possibilities for 'stand'.
 * @param action - The action to evaluate ('hit' or 'stand').
 * @param playerHand - The player's current hand.
 * @param dealerUpCard - The dealer's visible card.
 * @param remainingShoe - The cards left in the shoe.
 * @returns A simplified EV score.
 */
export const calculateExpectedValue = (action: PlayerAction, playerHand: Hand, dealerUpCard: Card, remainingShoe: Card[]): number => {
    if (action !== 'hit' && action !== 'stand') return 0; // Simplified for this trainer

    const playerValue = getHandValue(playerHand);

    // Estimate dealer's final hand distribution based on up-card (using standard tables)
    // Probabilities of dealer busting or ending with 17, 18, 19, 20, 21 for each upcard.
    const dealerProbabilities: Record<string, { bust: number, '17': number, '18': number, '19':number, '20':number, '21':number}> = {
        '2': { bust: .35, '17': .14, '18': .13, '19': .13, '20': .12, '21': .13 },
        '3': { bust: .37, '17': .13, '18': .13, '19': .12, '20': .12, '21': .13 },
        '4': { bust: .40, '17': .12, '18': .12, '19': .12, '20': .12, '21': .12 },
        '5': { bust: .42, '17': .12, '18': .12, '19': .12, '20': .11, '21': .11 },
        '6': { bust: .42, '17': .11, '18': .11, '19': .11, '20': .11, '21': .14 },
        '7': { bust: .26, '17': .37, '18': .13, '19': .0, '20': .0, '21': .24 },
        '8': { bust: .24, '17': .0, '18': .36, '19': .13, '20': .0, '21': .27 },
        '9': { bust: .23, '17': .0, '18': .0, '19': .34, '20': .12, '21': .31 },
        'T': { bust: .21, '17': .0, '18': .0, '19': .0, '20': .37, '21': .42 },
        'A': { bust: .17, '17': .15, '18': .15, '19': .15, '20': .15, '21': .23 },
    };
    const dealerProbs = dealerProbabilities[dealerUpCard.rank] || dealerProbabilities['T']; // T, J, Q, K are same

    if (action === 'stand') {
        if (playerValue.total > 21) return -1; // Loss
        let ev = 0;
        ev += dealerProbs.bust; // Win
        for (const [scoreStr, prob] of Object.entries(dealerProbs)) {
            if (scoreStr === 'bust') continue;
            const score = parseInt(scoreStr, 10);
            if (playerValue.total > score) ev += prob; // Win
            if (playerValue.total < score) ev -= prob; // Loss
        }
        return ev;
    }

    if (action === 'hit') {
        let totalEv = 0;
        const shoeSize = remainingShoe.length;
        if (shoeSize === 0) return -1;
        
        // Count remaining cards of each rank
        const remainingCounts = RANKS.reduce((acc, rank) => ({...acc, [rank]: 0}), {} as Record<string, number>);
        remainingShoe.forEach(card => remainingCounts[card.rank]++);
        
        for (const rank of RANKS) {
            const count = remainingCounts[rank];
            if(count === 0) continue;
            
            const prob = count / shoeSize;
            // FIX: Explicitly type `newHand` as `Hand` to ensure correct type inference for the temporary card object.
            const newHand: Hand = [...playerHand, { rank: rank, suit: 'spades' }]; // Suit doesn't matter for value
            const newHandValue = getHandValue(newHand);

            if (newHandValue.total > 21) {
                totalEv -= prob; // Bust is a loss of 1 unit
            } else {
                // If we don't bust, calculate the EV of standing with the new hand
                totalEv += prob * calculateExpectedValue('stand', newHand, dealerUpCard, remainingShoe);
            }
        }
        return totalEv;
    }

    return 0;
};
