
import { useState, useCallback } from 'react';

interface SentimentResult {
  mood: 'happy' | 'sad' | 'angry' | 'neutral';
  confidence: number;
}

export const useSentimentAnalysis = () => {
  const [currentMood, setCurrentMood] = useState<'happy' | 'sad' | 'angry' | 'neutral'>('neutral');

  const analyzeSentiment = useCallback((text: string): SentimentResult => {
    const lowerText = text.toLowerCase();
    
    // Happy indicators
    const happyWords = ['great', 'awesome', 'excellent', 'wonderful', 'amazing', 'love', 'fantastic', 'perfect', 'good', 'happy', '😊', '😄', '🎉', '👍'];
    const happyScore = happyWords.filter(word => lowerText.includes(word)).length;
    
    // Sad indicators
    const sadWords = ['sad', 'depressed', 'terrible', 'awful', 'horrible', 'disappointed', 'upset', 'cry', 'crying', '😢', '😭', '💔'];
    const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
    
    // Angry indicators
    const angryWords = ['angry', 'mad', 'furious', 'rage', 'hate', 'stupid', 'idiot', 'damn', 'hell', '😡', '🤬', '😠'];
    const angryScore = angryWords.filter(word => lowerText.includes(word)).length;
    
    // Determine mood
    let mood: 'happy' | 'sad' | 'angry' | 'neutral' = 'neutral';
    let confidence = 0;
    
    if (happyScore > sadScore && happyScore > angryScore && happyScore > 0) {
      mood = 'happy';
      confidence = Math.min(happyScore * 0.3, 1);
    } else if (sadScore > happyScore && sadScore > angryScore && sadScore > 0) {
      mood = 'sad';
      confidence = Math.min(sadScore * 0.3, 1);
    } else if (angryScore > happyScore && angryScore > sadScore && angryScore > 0) {
      mood = 'angry';
      confidence = Math.min(angryScore * 0.3, 1);
    }
    
    setCurrentMood(mood);
    return { mood, confidence };
  }, []);

  return { analyzeSentiment, currentMood };
};
