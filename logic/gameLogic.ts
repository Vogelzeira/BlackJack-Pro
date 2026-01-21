
import { Card, Hand, HandValue, HandResultType, Rank, HandStatus } from '../types';
import { DECK, CARD_VALUES } from '../constants';

/**
 * Creates a "shoe" of multiple decks of cards.
 * @param numberOfDecks - The number of 52-card decks to include.
 * @returns An array of Card objects.
 */
export const createShoe = (numberOfDecks: number): Card[] => {
    const shoe = Array(numberOfDecks).fill(DECK).flat();
    return shuffle(shoe);
};

/**
 * Shuffles an array of cards using the Fisher-Yates algorithm.
 * @param deck - The array of cards to shuffle.
 * @returns A new array with the cards shuffled.
 */
export const shuffle = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Deals one card from the top of the shoe.
 * @param shoe - The current shoe of cards.
 * @returns A tuple containing the dealt card and the remaining shoe.
 */
export const dealCard = (shoe: Card[]): [Card, Card[]] => {
    const newShoe = [...shoe];
    const card = newShoe.pop();
    if (!card) {
        throw new Error("Shoe is empty!");
    }
    return [card, newShoe];
};

/**
 * Calculates the total value of a hand, accounting for Aces.
 * @param hand - The hand of cards to evaluate.
 * @returns An object with the total value and a boolean indicating if it's a soft hand.
 */
export const getHandValue = (hand: Hand): HandValue => {
    let total = 0;
    let aces = 0;
    let soft = false;

    for (const card of hand) {
        if (card.rank === 'A') {
            aces += 1;
            total += CARD_VALUES.A.primary;
        } else {
            total += CARD_VALUES[card.rank].primary;
        }
    }
    
    // Adjust for aces if total is over 21
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }

    if (aces > 0 && total + 10 <= 21) {
        soft = hand.some(c => c.rank === 'A' && total - CARD_VALUES.A.primary + 11 <= 21);
    }
    
    // The previous logic was complex, this simplifies it.
    // Let's re-calculate soft status more directly
    let finalAces = hand.filter(c => c.rank === 'A').length;
    let nonAceTotal = hand
        .filter(c => c.rank !== 'A')
        .reduce((sum, card) => sum + CARD_VALUES[card.rank].primary, 0);

    let finalTotal = nonAceTotal + finalAces * 11;
    let finalSoft = false;
    
    while(finalTotal > 21 && finalAces > 0) {
        finalTotal -= 10;
        finalAces--;
    }
    
    if (finalAces > 0) {
        finalSoft = true;
    }

    return { total: finalTotal, soft: finalSoft };
};

export const isSoft = (hand: Hand): boolean => {
    return getHandValue(hand).soft;
};

export const getHandStatus = (hand: Hand): HandStatus => {
    const value = getHandValue(hand);
    if (value.total > 21) return 'bust';
    if (value.total === 21 && hand.length === 2) return 'blackjack';
    return 'active';
};


/**
 * Determines the winner of the hand.
 * @param playerHand - The player's final hand.
 * @param dealerHand - The dealer's final hand.
 * @param playerHadBlackjack - Flag for player Blackjack to ensure proper payout logic.
 * @returns The result of the hand.
 */
export const determineWinner = (playerHand: Hand, dealerHand: Hand, playerHadBlackjack: boolean): HandResultType => {
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);
    const dealerHadBlackjack = dealerValue.total === 21 && dealerHand.length === 2;
    
    if (playerHadBlackjack) {
        return dealerHadBlackjack ? 'push' : 'player_blackjack';
    }

    if (playerValue.total > 21) return 'dealer_win';
    if (dealerValue.total > 21) return 'player_win';
    if (playerValue.total > dealerValue.total) return 'player_win';
    if (dealerValue.total > playerValue.total) return 'dealer_win';
    return 'push';
};
