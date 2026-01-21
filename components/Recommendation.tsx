
import React from 'react';
import { StrategyAction } from '../types';

interface RecommendationProps {
    recommendation: {
        action: StrategyAction;
        reason: string;
        bustProbability: number;
        expectedValues: { hit: number, stand: number };
    } | null;
}

const Recommendation: React.FC<RecommendationProps> = ({ recommendation }) => {
    if (!recommendation) return null;

    const { action, reason, bustProbability, expectedValues } = recommendation;

    return (
        <div className="mt-4 p-4 bg-blue-900/40 border-2 border-blue-500 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center justify-center md:justify-start">
                <div className="text-center md:text-left">
                    <p className="text-sm text-blue-300 uppercase tracking-wider">Recommended Action</p>
                    <p className="text-4xl font-bold text-yellow-300 uppercase tracking-widest">{action}</p>
                </div>
                 <div className="hidden md:block border-l-2 border-blue-600 h-16 mx-6"></div>
                <div className="hidden md:block">
                    <p className="text-lg text-gray-300 font-semibold">Justification</p>
                    <p className="text-sm text-gray-400 max-w-lg">{reason}</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-700 text-xs text-gray-400 grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
                 <div>
                    <span className="font-semibold text-gray-300">Bust on Hit: </span> 
                    <span className="font-mono text-red-400">{(bustProbability * 100).toFixed(1)}%</span>
                </div>
                 <div>
                    <span className="font-semibold text-gray-300">EV (Hit): </span>
                    <span className={`font-mono ${expectedValues.hit > 0 ? 'text-green-400' : 'text-red-400'}`}>{expectedValues.hit.toFixed(3)}</span>
                </div>
                 <div>
                    <span className="font-semibold text-gray-300">EV (Stand): </span>
                     <span className={`font-mono ${expectedValues.stand > 0 ? 'text-green-400' : 'text-red-400'}`}>{expectedValues.stand.toFixed(3)}</span>
                </div>
            </div>
        </div>
    );
};

export default Recommendation;
