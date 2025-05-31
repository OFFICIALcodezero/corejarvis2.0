
import { supabase } from '@/integrations/supabase/client';
import { memoryService } from './memoryService';

export class VoiceAIService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private micActive: boolean = false;
  private onTranscriptCallback?: (text: string) => void;
  private onStatusCallback?: (status: 'listening' | 'idle' | 'processing') => void;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }

    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusCallback?.('listening');
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.micActive = false;
      this.onStatusCallback?.('idle');
      console.log('Voice recognition ended');
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.processTranscript(finalTranscript.trim());
        this.onTranscriptCallback?.(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.micActive = false;
      this.onStatusCallback?.('idle');
    };
  }

  private async processTranscript(transcript: string) {
    try {
      this.onStatusCallback?.('processing');
      
      // Detect intent
      const intent = this.detectIntent(transcript);
      
      // Store voice input in database
      await memoryService.storeVoiceInput(transcript, undefined, intent);
      
      // Check for learning triggers (handled by database trigger)
      if (this.isLearningTrigger(transcript)) {
        console.log('Learning trigger detected, storing in persistent knowledge');
      }
      
      // Store in memory log
      await memoryService.storeMemory(transcript, undefined, [intent]);
      
    } catch (error) {
      console.error('Error processing transcript:', error);
    } finally {
      this.onStatusCallback?.('idle');
    }
  }

  private detectIntent(transcript: string): string {
    const lowerText = transcript.toLowerCase();
    
    if (lowerText.includes('calendar') || lowerText.includes('schedule') || lowerText.includes('meeting')) {
      return 'calendar';
    }
    if (lowerText.includes('reminder') || lowerText.includes('remind')) {
      return 'reminder';
    }
    if (lowerText.includes('note') || lowerText.includes('write down')) {
      return 'note';
    }
    if (lowerText.includes('search') || lowerText.includes('find')) {
      return 'search';
    }
    if (lowerText.includes('weather')) {
      return 'weather';
    }
    if (lowerText.includes('time') || lowerText.includes('clock')) {
      return 'time';
    }
    if (this.isLearningTrigger(transcript)) {
      return 'learning';
    }
    
    return 'general';
  }

  private isLearningTrigger(transcript: string): boolean {
    const lowerText = transcript.toLowerCase();
    return lowerText.includes('remember this') || 
           lowerText.includes('learn this') || 
           lowerText.includes('store this') || 
           lowerText.includes('add this to your brain');
  }

  public startListening(onTranscript?: (text: string) => void, onStatus?: (status: 'listening' | 'idle' | 'processing') => void) {
    if (this.micActive || !this.recognition) return;
    
    this.micActive = true;
    this.onTranscriptCallback = onTranscript;
    this.onStatusCallback = onStatus;
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.micActive = false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.micActive = false;
  }

  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      this.synthesis.speak(utterance);
    });
  }

  public isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  public isActive(): boolean {
    return this.micActive;
  }
}

export const voiceAI = new VoiceAIService();
