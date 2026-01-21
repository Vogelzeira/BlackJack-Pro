

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Import `StrategyDecision` and update the `lastAction` state to hold the complete decision object rather than just the action string. This resolves all related type errors.
import { GameState, Card, Hand, CountingSystem, StrategyAction, Settings, PlayerAction, HandResult, HandStatus, StrategyDecision } from './types';
import { COUNTING_SYSTEMS, INITIAL_SETTINGS } from './constants';
import { createShoe, dealCard, getHandValue, determineWinner, isSoft, getHandStatus } from './logic/gameLogic';
import { calculateTrueCount, getCountValue } from './logic/countingLogic';
import { getOptimalAction } from './logic/strategyLogic';
import { calculateBustProbability, calculateExpectedValue } from './logic/probabilityLogic';
import { getStrategyExplanation } from './services/geminiService';
import GameBoard from './components/GameBoard';
import SidePanel from './components/SidePanel';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';
import Recommendation from './components/Recommendation';
import AIAnalysisModal from './components/AIAnalysisModal';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
    const [gameState, setGameState] = useState<GameState>('betting');
    const [shoe, setShoe] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Hand>([]);
    const [dealerHand, setDealerHand] = useState<Hand>([]);
    const [runningCount, setRunningCount] = useState<number>(0);
    const [handHistory, setHandHistory] = useState<HandResult[]>([]);
    const [sessionStats, setSessionStats] = useState({ handsPlayed: 0, correctMoves: 0, incorrectMoves: 0 });
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [aiExplanation, setAiExplanation] = useState<string>('');
    const [isGeneratingExplanation, setIsGeneratingExplanation] = useState<boolean>(false);
    const [lastAction, setLastAction] = useState<{ playerAction: PlayerAction, recommendedAction: StrategyDecision } | null>(null);

    const countingSystem: CountingSystem = useMemo(() => COUNTING_SYSTEMS[settings.countingSystem], [settings.countingSystem]);

    const resetShoe = useCallback(() => {
        const newShoe = createShoe(settings.numberOfDecks);
        setShoe(newShoe);
        setRunningCount(0);
        console.log(`Shoe reset with ${settings.numberOfDecks} decks.`);
    }, [settings.numberOfDecks]);

    useEffect(() => {
        resetShoe();
    }, [resetShoe]);

    const trueCount = useMemo(() => calculateTrueCount(runningCount, shoe.length, settings.numberOfDecks), [runningCount, shoe.length, settings.numberOfDecks]);

    const dealHand = () => {
        if (shoe.length < (52 * settings.numberOfDecks * 0.25)) { // Reshuffle at 75% penetration
            resetShoe();
            // Use setTimeout to allow state to update before dealing
            setTimeout(() => {
                startNewHand(createShoe(settings.numberOfDecks));
            }, 100);
        } else {
             startNewHand(shoe);
        }
    };
    
    const startNewHand = (currentShoe: Card[]) => {
        let tempShoe = [...currentShoe];
        let tempPlayerHand: Hand = [];
        let tempDealerHand: Hand = [];
        let tempRunningCount = runningCount;

        // Deal two cards to player and dealer
        for (let i = 0; i < 2; i++) {
            const [pCard, shoeAfterP] = dealCard(tempShoe);
            tempPlayerHand.push(pCard);
            tempRunningCount += getCountValue(pCard, countingSystem);
            tempShoe = shoeAfterP;

            const [dCard, shoeAfterD] = dealCard(tempShoe);
            tempDealerHand.push(dCard);
            if (i === 0) { // Only count dealer's up-card initially
                 tempRunningCount += getCountValue(dCard, countingSystem);
            }
            tempShoe = shoeAfterD;
        }

        setPlayerHand(tempPlayerHand);
        setDealerHand(tempDealerHand);
        setShoe(tempShoe);
        setRunningCount(tempRunningCount);
        setLastAction(null);

        const playerStatus = getHandStatus(tempPlayerHand);
        if (playerStatus === 'blackjack') {
            finishHand(tempPlayerHand, tempDealerHand, tempShoe, tempRunningCount, true);
        } else {
            setGameState('playerTurn');
        }
    }


    const handlePlayerAction = (action: PlayerAction) => {
        if (gameState !== 'playerTurn') return;
        
        const recommendedAction = getOptimalAction(playerHand, dealerHand[0], trueCount, settings.numberOfDecks);
        setLastAction({ playerAction: action, recommendedAction });

        const isCorrectMove = action.toLowerCase() === recommendedAction.action.toLowerCase();
        setSessionStats(prev => ({
            ...prev,
            correctMoves: isCorrectMove ? prev.correctMoves + 1 : prev.correctMoves,
            incorrectMoves: !isCorrectMove ? prev.incorrectMoves + 1 : prev.incorrectMoves,
        }));

        switch (action) {
            case 'hit':
                hit();
                break;
            case 'stand':
                stand();
                break;
            case 'double':
                // For simplicity, we just hit once and stand. Real double rules vary.
                hit(true);
                break;
        }
    };
    
    const hit = (isDoubleDown = false) => {
        const [newCard, newShoe] = dealCard(shoe);
        const newPlayerHand = [...playerHand, newCard];
        const newRunningCount = runningCount + getCountValue(newCard, countingSystem);

        setPlayerHand(newPlayerHand);
        setShoe(newShoe);
        setRunningCount(newRunningCount);
        
        const handStatus = getHandStatus(newPlayerHand);

        if (handStatus === 'bust' || isDoubleDown) {
            // Reveal dealer's hole card and update count before finishing
            const holeCardCount = getCountValue(dealerHand[1], countingSystem);
            finishHand(newPlayerHand, dealerHand, newShoe, newRunningCount + holeCardCount);
        }
    };

    const stand = () => {
        // Reveal dealer's hole card and update count, then start dealer's turn
        const holeCardCount = getCountValue(dealerHand[1], countingSystem);
        setRunningCount(prev => prev + holeCardCount);
        setGameState('dealerTurn');
    };
    
    useEffect(() => {
        if (gameState === 'dealerTurn') {
            let currentDealerHand = [...dealerHand];
            let currentShoe = [...shoe];
            let currentRunningCount = runningCount;

            // Dealer hits until 17 or more
            while (getHandValue(currentDealerHand).total < 17 || (getHandValue(currentDealerHand).total === 17 && getHandValue(currentDealerHand).soft)) {
                const [newCard, newShoe] = dealCard(currentShoe);
                currentDealerHand.push(newCard);
                currentShoe = newShoe;
                currentRunningCount += getCountValue(newCard, countingSystem);
            }
            
            finishHand(playerHand, currentDealerHand, currentShoe, currentRunningCount);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);


    const finishHand = (finalPlayerHand: Hand, finalDealerHand: Hand, finalShoe: Card[], finalRunningCount: number, playerHadBlackjack = false) => {
        const result = determineWinner(finalPlayerHand, finalDealerHand, playerHadBlackjack);
        
        const newHandResult: HandResult = {
            playerHand: finalPlayerHand,
            dealerHand: finalDealerHand,
            result: result,
            playerAction: lastAction?.playerAction,
            recommendedAction: lastAction?.recommendedAction,
        };
        
        setHandHistory(prev => [newHandResult, ...prev].slice(0, 10));
        setSessionStats(prev => ({ ...prev, handsPlayed: prev.handsPlayed + 1 }));
        
        // Update final state
        setPlayerHand(finalPlayerHand);
        setDealerHand(finalDealerHand);
        setShoe(finalShoe);
        setRunningCount(finalRunningCount);
        setGameState('endOfHand');
    };

    const handleExplainMistake = async () => {
        if (!lastAction || !dealerHand[0] || lastAction.playerAction === lastAction.recommendedAction.action) return;

        setIsGeneratingExplanation(true);
        setAiExplanation('');
        try {
            const explanation = await getStrategyExplanation({
                playerHand,
                dealerUpCard: dealerHand[0],
                trueCount,
                playerAction: lastAction.playerAction,
                recommendedAction: lastAction.recommendedAction.action
            });
            setAiExplanation(explanation);
        } catch (error) {
            console.error("Error fetching explanation from Gemini:", error);
            setAiExplanation("Sorry, I couldn't generate an explanation at this time. Please check your API key and try again.");
        } finally {
            setIsGeneratingExplanation(false);
        }
    };
    
    const recommendation = useMemo(() => {
        if (gameState !== 'playerTurn') return null;
        const optimalAction = getOptimalAction(playerHand, dealerHand[0], trueCount, settings.numberOfDecks);
        const bustProb = calculateBustProbability(playerHand, shoe);
        const ev = {
            hit: calculateExpectedValue('hit', playerHand, dealerHand[0], shoe),
            stand: calculateExpectedValue('stand', playerHand, dealerHand[0], shoe),
        }
        return {
            action: optimalAction.action,
            reason: optimalAction.reason,
            bustProbability: bustProb,
            expectedValues: ev
        }
    }, [gameState, playerHand, dealerHand, trueCount, shoe, settings.numberOfDecks]);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 relative">
            <div className="absolute top-2 left-2 text-xs text-gray-600 font-mono">EDUCATIONAL USE ONLY</div>
            <h1 className="text-3xl md:text-5xl font-bold text-emerald-400 mb-2 tracking-wider shadow-lg">
                Blackjack Card Counting Trainer
            </h1>
            <p className="text-gray-400 mb-4">Master strategy with real-time AI-powered feedback.</p>
            
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-gray-700 flex-grow">
                         <GameBoard
                            playerHand={playerHand}
                            dealerHand={dealerHand}
                            gameState={gameState}
                        />
                         {recommendation && <Recommendation recommendation={recommendation} />}
                    </div>
                   <Controls
                        gameState={gameState}
                        onDeal={dealHand}
                        onPlayerAction={handlePlayerAction}
                        canDouble={playerHand.length === 2}
                    />
                </div>
                <div className="lg:col-span-1">
                    <SidePanel
                        settings={settings}
                        runningCount={runningCount}
                        trueCount={trueCount}
                        shoeSize={shoe.length}
                        initialShoeSize={52 * settings.numberOfDecks}
                        handHistory={handHistory}
                        sessionStats={sessionStats}
                        onShowSettings={() => setShowSettings(true)}
                    />
                </div>
            </div>

            {lastAction && lastAction.playerAction.toLowerCase() !== lastAction.recommendedAction.action.toLowerCase() && gameState === 'endOfHand' && (
                <div className="fixed bottom-4 right-4">
                    <button 
                        onClick={handleExplainMistake}
                        disabled={isGeneratingExplanation}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isGeneratingExplanation ? 'Analyzing...' : 'Why Was My Play Wrong?'}
                    </button>
                </div>
            )}

            <Disclaimer />

            {showSettings && (
                <SettingsModal
                    currentSettings={settings}
                    onSave={(newSettings) => {
                        setSettings(newSettings);
                        setGameState('betting');
                        setHandHistory([]);
                        setSessionStats({ handsPlayed: 0, correctMoves: 0, incorrectMoves: 0 });
                        // Reset shoe will be triggered by useEffect
                        setShowSettings(false);
                    }}
                    onClose={() => setShowSettings(false)}
                />
            )}
            
            <AIAnalysisModal
                isOpen={!!aiExplanation}
                onClose={() => setAiExplanation('')}
                explanation={aiExplanation}
                isLoading={isGeneratingExplanation}
            />

        </div>
    );
};

export default App;