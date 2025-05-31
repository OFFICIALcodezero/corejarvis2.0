
import React, { useState } from "react";
import ChatLayout from "./chat/ChatLayout";
import { useJarvisChat } from "./JarvisChatContext";

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
  const isTyping = false;
  const currentTypingText = "";
  const selectedLanguage = "en";
  const setSelectedLanguage = () => {};
  const audioPlaying = isSpeaking;
  const [volume, setVolume] = useState(80);
  const stopSpeaking = () => {};
  const toggleMute = () => {};

  // Return suggestions based on context
  const getSuggestions = (): string[] => {
    return [
      "What's the weather today?",
      "Tell me a joke",
      "What can you help me with?"
    ];
  };

  const handleSendMessage = () => {
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput("");
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
      isListening={false}
      activeAssistant={activeAssistant as any}
      inputMode={inputMode}
      setInputMode={setInputMode}
      handleSendMessage={handleSendMessage}
      getSuggestions={getSuggestions}
      hackerMode={hackerMode}
      toggleListening={() => {}}
      detectedEmotion={getFaceAnalysisText()}
      detectedObjects={detectedObjects}
    />
  );
};

export default JarvisChatMain;
