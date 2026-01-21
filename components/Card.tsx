
import React from 'react';
import { Card, Suit } from '../types';

interface CardProps {
  card: Card | null; // null represents a face-down card
}

const suitSymbols: Record<Suit, { symbol: string, color: string }> = {
    hearts: { symbol: '♥', color: 'text-red-500' },
    diamonds: { symbol: '♦', color: 'text-red-500' },
    clubs: { symbol: '♣', color: 'text-gray-300' },
    spades: { symbol: '♠', color: 'text-gray-300' },
};

const CardComponent: React.FC<CardProps> = ({ card }) => {
    if (!card) {
        return (
            <div className="w-24 h-36 bg-blue-800 rounded-lg shadow-md border-2 border-blue-900 flex items-center justify-center">
                <div className="w-20 h-32 bg-blue-700 rounded-md border-2 border-blue-500 flex items-center justify-center">
                    <div className="text-blue-900 text-5xl font-bold opacity-50">?</div>
                </div>
            </div>
        );
    }

    const { suit, rank } = card;
    const { symbol, color } = suitSymbols[suit];

    return (
        <div className="w-24 h-36 bg-gray-50 rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col justify-between text-gray-800 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <div className={`text-left ${color}`}>
                <div className="font-bold text-2xl">{rank}</div>
                <div className="text-xl">{symbol}</div>
            </div>
            <div className={`text-right ${color}`}>
                <div className="text-xl">{symbol}</div>
                <div className="font-bold text-2xl transform rotate-180">{rank}</div>
            </div>
        </div>
    );
};

export default CardComponent;
