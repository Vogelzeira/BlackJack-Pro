
import React, { useState } from 'react';

const Disclaimer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
             <button onClick={() => setIsOpen(true)} className="fixed bottom-2 left-2 text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded hover:bg-gray-600">
                Show Disclaimer
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-900/80 backdrop-blur-sm border-t-2 border-yellow-500 p-3 text-yellow-100 shadow-lg z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h4 className="font-bold">Educational Tool Disclaimer</h4>
                        <p className="text-xs text-yellow-200">
                            This is an <strong className="uppercase">educational tool for studying probability and statistics</strong> in Blackjack. It is NOT intended for use with real-money gambling sites and is designed for simulation purposes only. Card counting is illegal in many jurisdictions. Always gamble responsibly.
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="ml-4 p-1 rounded-full text-yellow-200 hover:bg-yellow-700/50 flex-shrink-0">&times;</button>
            </div>
        </div>
    );
};

export default Disclaimer;
