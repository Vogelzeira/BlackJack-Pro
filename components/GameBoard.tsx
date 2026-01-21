
import React from 'react';
import { Hand, GameState } from '../types';
import { getHandValue } from '../logic/gameLogic';
import CardComponent from './Card';

interface GameBoardProps {
  playerHand: Hand;
  dealerHand: Hand;
  gameState: GameState;
}

const HandDisplay: React.FC<{ title: string; hand: Hand; isDealer: boolean; gameState: GameState }> = ({ title, hand, isDealer, gameState }) => {
    const isDealerTurn = gameState === 'dealerTurn' || gameState === 'endOfHand';
    
    // FIX: Prevent passing [undefined] to getHandValue when a hand is empty.
    // For the dealer's hidden hand, we only want to calculate the value of the single up-card.
    const handForValue = (isDealer && !isDealerTurn)
        ? (hand.length > 0 ? [hand[0]] : [])
        : hand;
    const handValue = getHandValue(handForValue);

    let valueText: string;
    if (hand.length === 0) {
        valueText = '0';
    } else if (isDealer && !isDealerTurn) {
        valueText = `${handValue.total}`;
    } else {
        if (handValue.soft && handValue.total <= 21) {
            valueText = `${handValue.total - 10} / ${handValue.total}`;
        } else {
            valueText = `${handValue.total}`;
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-400 mb-2 text-center tracking-wider">{title} ({valueText})</h2>
            <div className="flex justify-center items-center min-h-[140px] bg-black/20 p-2 rounded-lg">
                <div className="flex -space-x-12">
                     {hand.map((card, index) => (
                        <CardComponent 
                            key={`${card.rank}-${card.suit}-${index}`} 
                            card={ (isDealer && index === 1 && !isDealerTurn) ? null : card }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


const GameBoard: React.FC<GameBoardProps> = ({ playerHand, dealerHand, gameState }) => {
  const getGameStatusText = () => {
        const playerValue = getHandValue(playerHand);
        const dealerValue = getHandValue(dealerHand);

        if (gameState === 'endOfHand') {
            if (playerValue.total > 21) return "Player Busts!";
            if (playerValue.total === 21 && playerHand.length === 2 && !(dealerValue.total === 21 && dealerHand.length === 2)) return "Blackjack!";
            if (dealerValue.total > 21) return "Dealer Busts!";
            if (playerValue.total > dealerValue.total) return "You Win!";
            if (dealerValue.total > playerValue.total) return "Dealer Wins!";
            return "Push!";
        }
        return null;
    };
    
  const statusText = getGameStatusText();

  return (
    <div className="space-y-6 relative flex flex-col justify-between h-full">
        <HandDisplay title="Dealer's Hand" hand={dealerHand} isDealer={true} gameState={gameState} />
        {statusText && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/70 text-white text-3xl font-bold p-4 rounded-lg shadow-lg">
                    {statusText}
                </div>
            </div>
        )}
        <HandDisplay title="Your Hand" hand={playerHand} isDealer={false} gameState={gameState} />
    </div>
  );
};

export default GameBoard;
