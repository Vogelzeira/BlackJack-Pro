
import React from 'react';
import { Settings } from '../types';

interface StatsDisplayProps {
    runningCount: number;
    trueCount: number;
    shoeSize: number;
    initialShoeSize: number;
    settings: Settings;
}

const StatItem: React.FC<{ label: string, value: string | number, color: string, tooltip: string }> = ({ label, value, color, tooltip }) => (
    <div className="bg-gray-700/50 p-3 rounded-lg text-center relative group">
        <div className="text-sm text-gray-400">{label}</div>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <div className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {tooltip}
        </div>
    </div>
);

const StatsDisplay: React.FC<StatsDisplayProps> = ({ runningCount, trueCount, shoeSize, initialShoeSize, settings }) => {
    const penetration = initialShoeSize > 0 ? ((initialShoeSize - shoeSize) / initialShoeSize) * 100 : 0;
    
    const getCountColor = (count: number) => {
        if (count > 1) return 'text-green-400';
        if (count < -1) return 'text-red-400';
        return 'text-gray-200';
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <StatItem 
                    label="Running Count" 
                    value={runningCount} 
                    color={getCountColor(runningCount)}
                    tooltip="The sum of the values of all cards seen so far. The core of any counting system."
                />
                <StatItem 
                    label="True Count" 
                    value={trueCount.toFixed(2)} 
                    color={getCountColor(trueCount)}
                    tooltip="Running Count divided by remaining decks. A more accurate measure of player advantage."
                />
            </div>
             <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-400 flex justify-between items-center">
                    <span>Deck Penetration</span>
                    <span>{penetration.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${penetration}%` }}></div>
                </div>
            </div>
            <div className="text-center text-sm text-gray-400 pt-2">
                Using <span className="font-semibold text-emerald-400">{settings.countingSystem}</span> on <span className="font-semibold text-emerald-400">{settings.numberOfDecks}</span> decks.
            </div>
        </div>
    );
};

export default StatsDisplay;
