
import React from 'react';

interface SessionStatsProps {
    stats: {
        handsPlayed: number;
        correctMoves: number;
        incorrectMoves: number;
    };
}

const SessionStats: React.FC<SessionStatsProps> = ({ stats }) => {
    const { handsPlayed, correctMoves, incorrectMoves } = stats;
    const totalDecisions = correctMoves + incorrectMoves;
    const accuracy = totalDecisions > 0 ? (correctMoves / totalDecisions) * 100 : 100;

    return (
        <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-3 text-center">Session Statistics</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Hands Played:</span>
                    <span className="font-mono font-semibold text-white">{handsPlayed}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Correct Decisions:</span>
                    <span className="font-mono font-semibold text-green-400">{correctMoves}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Incorrect Decisions:</span>
                    <span className="font-mono font-semibold text-red-400">{incorrectMoves}</span>
                </div>
                 <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400">Decision Accuracy:</span>
                    <div className="flex items-center">
                        <span className={`font-mono font-bold text-lg mr-2 ${accuracy > 90 ? 'text-green-400' : accuracy > 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {accuracy.toFixed(1)}%
                        </span>
                        <div className="w-20 bg-gray-600 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${accuracy}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionStats;
