
import { GoogleGenAI } from "@google/genai";
import { AIAnalysisRequest } from '../types';
import { getHandValue } from "../logic/gameLogic";

let ai: GoogleGenAI | null = null;

const initializeGemini = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    // In a real app, you would handle this more gracefully.
    // For this educational tool, we will return an error message.
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


export const getStrategyExplanation = async (request: AIAnalysisRequest): Promise<string> => {
    const aiInstance = initializeGemini();
    if (!aiInstance) {
        return "Gemini API key is not configured. Please set the API_KEY in your environment variables to enable this feature.";
    }

    const { playerHand, dealerUpCard, trueCount, playerAction, recommendedAction } = request;
    const playerHandStr = playerHand.map(c => c.rank).join(', ');
    // FIX: Use the getHandValue function to correctly calculate hand totals, including soft hands.
    const playerValue = getHandValue(playerHand);
    const playerTotalStr = playerValue.soft ? `${playerValue.total - 10}/${playerValue.total}` : `${playerValue.total}`;


    const prompt = `
        You are an expert Blackjack strategy instructor for students learning card counting.
        A student made a mistake and needs a clear, encouraging, and educational explanation.
        
        **Game Context:**
        - **Player's Hand:** ${playerHandStr} (Total: ${playerTotalStr})
        - **Dealer's Up-Card:** ${dealerUpCard.rank}
        - **True Count:** ${trueCount.toFixed(2)}
        - **Student's Action:** ${playerAction}
        - **Correct Action:** ${recommendedAction}

        **Your Task:**
        Explain concisely why the student's action was incorrect and why the recommended action was the better strategic choice.
        
        **Guidelines:**
        1.  **Be Encouraging:** Start with a positive and supportive tone.
        2.  **Explain the "Why":** Focus on the reasoning. Mention the True Count if it's a key factor in the decision.
        3.  **Use Simple Math:** Talk about concepts like "the deck is rich in high cards" or "risk of busting" in simple terms.
        4.  **Structure:**
            -   Acknowledge the situation.
            -   Explain why their move was risky or less optimal.
            -   Explain why the correct move is better, linking it to the game context (especially dealer's card and true count).
            -   End with an encouraging sentence.
        5. **Keep it brief:** Aim for 3-4 sentences.
    `;

    try {
        const response = await aiInstance.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        if (response.text) {
            return response.text;
        }
        return "Could not get an explanation from the AI.";

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while trying to get an explanation. Please check the console for details.";
    }
};
