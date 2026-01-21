
import React from 'react';
import { GameState, PlayerAction } from '../types';

interface ControlsProps {
  gameState: GameState;
  onDeal: () => void;
  onPlayerAction: (action: PlayerAction) => void;
  canDouble: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled, children, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-lg font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
    >
        {children}
    </button>
);


const Controls: React.FC<ControlsProps> = ({ gameState, onDeal, onPlayerAction, canDouble }) => {
  const isPlayerTurn = gameState === 'playerTurn';
  
  if (gameState === 'betting' || gameState === 'endOfHand') {
    return (
        <div className="mt-4">
            <ActionButton onClick={onDeal} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Deal New Hand
            </ActionButton>
        </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        <ActionButton onClick={() => onPlayerAction('hit')} disabled={!isPlayerTurn} className="bg-green-600 hover:bg-green-500 text-white">
            Hit
        </ActionButton>
        <ActionButton onClick={() => onPlayerAction('stand')} disabled={!isPlayerTurn} className="bg-red-600 hover:bg-red-500 text-white">
            Stand
        </ActionButton>
        <ActionButton onClick={() => onPlayerAction('double')} disabled={!isPlayerTurn || !canDouble} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 col-span-2 md:col-span-1">
            Double
        </ActionButton>
    </div>
  );
};

export default Controls;
