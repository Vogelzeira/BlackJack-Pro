
import React from 'react';
import { HandResult, HandResultType, Card } from '../types';
import { getHandValue } from '../logic/gameLogic';

const MiniCard: React.FC<{ card: Card }> = ({ card }) => {
    const suitSymbols: Record<string, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    const color = (card.suit === 'hearts' || card.suit === 'diamonds') ? 'text-red-500' : 'text-gray-300';
    return (
        <span className={`font-bold ${color}`}>{card.rank}{suitSymbols[card.suit]}</span>
    );
};

const HandHistory: React.FC<{ history: HandResult[] }> = ({ history }) => {
    
    const getResultTextAndColor = (result: HandResultType) => {
        switch(result) {
            case 'player_win': return { text: 'Win', color: 'text-green-400' };
            case 'dealer_win': return { text: 'Loss', color: 'text-red-400' };
            case 'push': return { text: 'Push', color: 'text-yellow-400' };
            case 'player_blackjack': return { text: 'BJ!', color: 'text-emerald-300' };
            default: return { text: 'N/A', color: 'text-gray-400'};
        }
    };

    return (
        <div className="flex-grow flex flex-col">
            <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">Hand History</h3>
            <div className="bg-gray-700/50 p-2 rounded-lg flex-grow overflow-y-auto max-h-48">
                {history.length === 0 ? (
                    <p className="text-center text-gray-500 pt-4">Play a hand to see history.</p>
                ) : (
                    <ul className="space-y-2">
                        {history.map((hand, index) => {
                             const { text, color } = getResultTextAndColor(hand.result);
                             return (
                                <li key={index} className="flex justify-between items-center text-xs bg-gray-800/60 p-2 rounded">
                                    <div className="w-1/4">
                                        <span className={`font-bold ${color}`}>{text}</span>
                                    </div>
                                    <div className="w-1/2 text-center space-x-1">
                                       <span className="text-gray-400">P:</span> {hand.playerHand.map((c, i) => <MiniCard key={i} card={c}/>)}
                                       <span className="mx-1 text-gray-500">vs</span>
                                       <span className="text-gray-400">D:</span> {hand.dealerHand.map((c, i) => <MiniCard key={i} card={c}/>)}
                                    </div>
                                    <div className="w-1/4 text-right">
                                        <span className="text-gray-400">
                                            {getHandValue(hand.playerHand).total} vs {getHandValue(hand.dealerHand).total}
                                        </span>
                                    </div>
                                </li>
                             );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HandHistory;
