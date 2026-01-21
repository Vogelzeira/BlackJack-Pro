
import React from 'react';
import { Settings, HandResult } from '../types';
import StatsDisplay from './StatsDisplay';
import HandHistory from './HandHistory';
import SessionStats from './SessionStats';

interface SidePanelProps {
    settings: Settings;
    runningCount: number;
    trueCount: number;
    shoeSize: number;
    initialShoeSize: number;
    handHistory: HandResult[];
    sessionStats: { handsPlayed: number; correctMoves: number; incorrectMoves: number };
    onShowSettings: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
    settings,
    runningCount,
    trueCount,
    shoeSize,
    initialShoeSize,
    handHistory,
    sessionStats,
    onShowSettings
}) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-gray-700 space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-emerald-400">Session Info</h2>
                <button onClick={onShowSettings} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
            <StatsDisplay 
                runningCount={runningCount}
                trueCount={trueCount}
                shoeSize={shoeSize}
                initialShoeSize={initialShoeSize}
                settings={settings}
            />
            <SessionStats stats={sessionStats} />
            <HandHistory history={handHistory} />
        </div>
    );
};

export default SidePanel;
