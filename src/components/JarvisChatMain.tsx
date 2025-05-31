
import React, { useState, useEffect, useRef } from "react";
import ChatLayout from "./chat/ChatLayout";
import { useJarvisChat } from "./JarvisChatContext";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface JarvisChatMainProps {
  hackerMode?: boolean;
  detectedEmotion?: string;
  detectedAge?: number | null;
  detectedGender?: string | null;
  detectedObjects?: Array<{ class: string; confidence: number }>;
}

const JarvisChatMain: React.FC<JarvisChatMainProps> = ({ 
  hackerMode = false, 
  detectedEmotion,
  detectedAge,
  detectedGender,
  detectedObjects
}) => {
  const {
    messages, 
    sendMessage, 
    isProcessing,
    activeAssistant,
    inputMode, 
    setInputMode,
    isSpeaking,
    activeMode
  } = useJarvisChat();
  
  const [input, setInput] = useState("");
  const [manualListening, setManualListening] = useState(false);
  const isTyping = false;
  const currentTypingText = "";
  const selectedLanguage = "en";
  const setSelectedLanguage = () => {};
  const audioPlaying = isSpeaking;
  const [volume, setVolume] = useState(80);
  const stopSpeaking = () => {};
  const toggleMute = () => {};
  
  // Track whether we should listen after processing
  const shouldResumeListeningRef = useRef(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript
  } = useSpeechRecognition();
  
  // Process voice input when in voice mode and manually activated
  useEffect(() => {
    if (manualListening && transcript && !isProcessing && !isSpeaking) {
      const processedTranscript = transcript.trim();
      
      if (processedTranscript) {
        console.log("Processing voice input:", processedTranscript);
        
        // Check for wake word (case insensitive)
        const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(processedTranscript);
        
        if (hasWakeWord) {
          console.log("Wake word detected, sending message:", processedTranscript);
          
          // Stop listening while processing
          shouldResumeListeningRef.current = true;
          setManualListening(false);
          stopListening();
          
          // Send the message
          sendMessage(processedTranscript);
          clearTranscript();
        } else {
          console.log("No wake word detected in:", processedTranscript);
        }
      }
    }
  }, [transcript, manualListening, isProcessing, isSpeaking, sendMessage, clearTranscript, stopListening]);
  
  // When processing ends, resume listening if it was manually activated
  useEffect(() => {
    if (!isProcessing && manualListening && shouldResumeListeningRef.current && !isListening) {
      console.log("Processing ended, resuming voice listening");
      shouldResumeListeningRef.current = false;
      
      // Short delay to prevent rapid restart
      const resumeTimer = setTimeout(() => {
        if (manualListening && !isListening) {
          console.log("Resuming listening after processing");
          startListening();
        }
      }, 1000);
      
      return () => clearTimeout(resumeTimer);
    }
  }, [isProcessing, manualListening, isListening, startListening]);

  // Handle Jarvis speaking - pause listening while speaking
  useEffect(() => {
    if (isSpeaking && isListening) {
      console.log("Jarvis is speaking, pausing listening");
      shouldResumeListeningRef.current = true;
      stopListening();
    } else if (!isSpeaking && !isListening && manualListening && shouldResumeListeningRef.current) {
      console.log("Jarvis stopped speaking, resuming listening");
      shouldResumeListeningRef.current = false;
      
      // Short delay before resuming
      const resumeTimer = setTimeout(() => {
        if (manualListening && !isListening) {
          console.log("Resuming listening after speaking");
          startListening();
        }
      }, 1000);
      
      return () => clearTimeout(resumeTimer);
    }
  }, [isSpeaking, isListening, manualListening, startListening, stopListening]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        console.log("Stopping voice recognition on cleanup");
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  // Return suggestions based on context
  const getSuggestions = (): string[] => {
    // Simple suggestions - can be expanded based on context
    return [
      "Hey Jarvis, what's the weather today?",
      "Jarvis, tell me a joke",
      "Hey Jarvis, what can you help me with?"
    ];
  };

  const handleSendMessage = () => {
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput("");
    }
  };

  const toggleListeningHandler = () => {
    if (isListening || manualListening) {
      console.log("Manually stopping voice recognition");
      setManualListening(false);
      stopListening();
      shouldResumeListeningRef.current = false;
    } else {
      console.log("Manually starting voice recognition");
      setManualListening(true);
      clearTranscript();
      startListening();
      
      // If in text mode, switch to voice mode
      if (inputMode === 'text') {
        setInputMode('voice');
      }
    }
  };

  // Enhanced details for face mode
  const getFaceAnalysisText = () => {
    if (!detectedEmotion && !detectedAge && !detectedGender) return null;
    
    let text = "";
    if (detectedEmotion) text += `Emotion: ${detectedEmotion}`;
    if (detectedAge) text += text ? ` • Age: ~${detectedAge}` : `Age: ~${detectedAge}`;
    if (detectedGender) text += text ? ` • ${detectedGender}` : `${detectedGender}`;
    
    return text;
  };

  return (
    <ChatLayout
      messages={messages}
      input={input}
      setInput={setInput}
      isTyping={isTyping}
      currentTypingText={currentTypingText}
      isProcessing={isProcessing}
      selectedLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
      audioPlaying={audioPlaying}
      volume={volume}
      onVolumeChange={values => setVolume(values[0])}
      stopSpeaking={stopSpeaking}
      toggleMute={toggleMute}
      isListening={isListening || manualListening}
      activeAssistant={activeAssistant as any}
      inputMode={inputMode}
      setInputMode={setInputMode}
      handleSendMessage={handleSendMessage}
      getSuggestions={getSuggestions}
      hackerMode={hackerMode}
      toggleListening={toggleListeningHandler}
      detectedEmotion={getFaceAnalysisText()}
      detectedObjects={detectedObjects}
    />
  );
};

export default JarvisChatMain;
