
import React from 'react';

interface AIAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    isLoading: boolean;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ isOpen, onClose, explanation, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-700">&times;</button>
                <div className="flex items-center mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                         </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-300">AI Strategy Analysis</h2>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-md min-h-[150px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                            <p className="ml-3 text-gray-400">Gemini is analyzing your play...</p>
                        </div>
                    ) : (
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{explanation}</p>
                    )}
                </div>
                 <div className="mt-4 text-xs text-gray-500 text-center">
                    AI analysis is for educational purposes and may not always be perfect. Use it to deepen your understanding of strategy.
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisModal;
