
import { Card, CountingSystem } from '../types';

/**
 * Gets the count value of a single card based on the active counting system.
 * @param card - The card to evaluate.
 * @param system - The active counting system.
 * @returns The numerical value of the card for counting.
 */
export const getCountValue = (card: Card, system: CountingSystem): number => {
    return system.values[card.rank] || 0;
};

/**
 * Calculates the True Count, which is more accurate than the Running Count.
 * True Count = Running Count / Number of Decks Remaining
 * @param runningCount - The current running count.
 * @param cardsLeftInShoe - The number of cards remaining in the shoe.
 * @param totalDecks - The total number of decks the shoe started with.
 * @returns The calculated true count.
 */
export const calculateTrueCount = (runningCount: number, cardsLeftInShoe: number, totalDecks: number): number => {
    if (cardsLeftInShoe === 0) {
        return 0;
    }
    // Calculate remaining decks, ensuring it's at least a small fraction to avoid division by zero
    // A common practice is to round down to the nearest half-deck or full deck for manual counting.
    // For a program, we can be more precise.
    const decksRemaining = cardsLeftInShoe / 52;

    if (decksRemaining < 0.2) { // Unreliable if less than 1/5 of a deck is left
        return 0;
    }
    
    return runningCount / decksRemaining;
};
