import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { Message, MessageSuggestion, JarvisChatProps } from "@/types/chat";
import { generateAssistantResponse, synthesizeSpeech } from "@/services/aiAssistantService";
import { getVoiceId } from "@/utils/apiKeyManager";
import { processSkillCommand, isSkillCommand } from "@/services/skillsService";
import { saveToHistory } from "@/services/chatHistoryService";
import { toast } from "./ui/use-toast";

interface JarvisChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (content: string, suggestions?: MessageSuggestion[]) => Promise<void>;
  isProcessing: boolean;
  suggestions: MessageSuggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<MessageSuggestion[]>>;
  activeMode: 'normal' | 'voice' | 'face' | 'hacker' | 'satellite';
  isSpeaking: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  isImageOpen: boolean;
  setIsImageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeAssistant: string;
  setActiveAssistant: (assistant: string) => void;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
  showDashboard?: boolean;
  hackerModeActive?: boolean;
  isGeneratingImage: boolean;
  handleImageGenerationFromPrompt: (prompt: string) => Promise<any>;
}

const JarvisChatContext = createContext<JarvisChatContextType | undefined>(undefined);

export const JarvisChatProvider: React.FC<React.PropsWithChildren<JarvisChatProps>> = ({
  children,
  activeMode,
  setIsSpeaking,
  isListening,
  activeAssistant,
  setActiveAssistant,
  inputMode,
  setInputMode,
  onMessageCheck,
  hackerModeActive
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-message",
          content: "Hello! I'm JARVIS, your AI assistant. How can I help you today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);

      // Initial suggestions
      setSuggestions([
        {
          id: "s1",
          text: "What can you help me with?",
        },
        {
          id: "s2",
          text: "Generate an image for me",
        },
        {
          id: "s3",
          text: "What's the weather like today?",
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    // Update parent speaking state
    setIsSpeaking(isSpeakingState);
  }, [isSpeakingState, setIsSpeaking]);

  // Create and set up audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsSpeakingState(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Text-to-speech function
  const speakText = async (text: string) => {
    try {
      const voiceId = getVoiceId();
      if (!voiceId) return;

      setIsSpeakingState(true);

      const audioUrl = await synthesizeSpeech(text, voiceId);
      if (audioRef.current && audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsSpeakingState(false);
        });
      } else {
        setIsSpeakingState(false);
      }
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      setIsSpeakingState(false);
    }
  };

  const sendMessage = async (content: string, messageSuggestions?: MessageSuggestion[]) => {
    if (!content.trim()) return;
    
    // Check for hacker mode activation code if onMessageCheck is provided
    if (onMessageCheck && onMessageCheck(content)) {
      return; // If the message was handled by the hacker mode code, stop processing
    }

    setIsProcessing(true);

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      let response: Message;

      // Check if it's a skill-specific command
      if (isSkillCommand(content)) {
        const skillResponse = await processSkillCommand(content);
        
        response = {
          id: `skill-${Date.now()}`,
          content: skillResponse.text,
          role: "assistant",
          timestamp: new Date(),
          data: skillResponse.data,
          skillType: skillResponse.skillType
        };
        
        // Special handling for image generation
        if (skillResponse.skillType === 'stability-image' || skillResponse.skillType === 'image') {
          response = {
            ...response,
            generatedImage: skillResponse.data
          };
        }
        
        if (skillResponse.shouldSpeak && (activeMode === 'voice' || activeMode === 'face')) {
          speakText(skillResponse.text);
        }
      } else {
        const messagesForAPI = [
          ...messages.slice(-10).map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
          { role: 'user' as const, content },
        ];

        // Generate AI response
        const assistantResponse = await generateAssistantResponse(
          content,
          messagesForAPI,
          activeAssistant as any,
          'en'
        );

        response = {
          id: Date.now().toString(),
          content: assistantResponse,
          role: "assistant",
          timestamp: new Date(),
        };

        // Speak if in voice mode
        if (activeMode === 'voice' || activeMode === 'face') {
          speakText(assistantResponse);
        }
      }

      const updatedMessages = [...messages, newMessage, response];
      setMessages(updatedMessages);
      
      // Save conversation to history
      saveToHistory(updatedMessages);
      
      // Set new suggestions if provided
      if (messageSuggestions && messageSuggestions.length > 0) {
        setSuggestions(messageSuggestions);
      } else if (response.skillType === 'stability-image' || response.skillType === 'image') {
        // Image-specific suggestions
        setSuggestions([
          {
            id: `img1-${Date.now()}`,
            text: "Make it more vibrant",
          },
          {
            id: `img2-${Date.now()}`,
            text: "Show me a different version",
          },
          {
            id: `img3-${Date.now()}`,
            text: "Generate another image with sci-fi theme",
          },
        ]);
      } else {
        // Generate default suggestions based on conversation
        setSuggestions([
          {
            id: `s1-${Date.now()}`,
            text: "Tell me more about that",
          },
          {
            id: `s2-${Date.now()}`,
            text: "Can you help me with something else?",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the handleImageGenerationFromPrompt function
  const handleImageGenerationFromPrompt = async (prompt: string) => {
    setIsProcessing(true);
    setIsGeneratingImage(true);
    
    try {
      // Mock implementation - in a real app, this would call an AI image generation API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockImageResult = {
        url: "https://via.placeholder.com/512x512?text=Generated+Image",
        prompt: prompt,
        id: Date.now().toString()
      };
      
      // Add the generated image to messages
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've created an image based on your prompt: "${prompt}"`,
        timestamp: new Date(),
        generatedImage: { url: mockImageResult.url, prompt: mockImageResult.prompt }
      };
      
      setMessages(prev => [...prev, newMessage]);
      return mockImageResult;
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image Generation Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
      setIsGeneratingImage(false);
    }
  };

  return (
    <JarvisChatContext.Provider
      value={{
        messages,
        setMessages,
        sendMessage,
        isProcessing,
        suggestions,
        setSuggestions,
        activeMode,
        isSpeaking: isSpeakingState,
        setIsSpeaking: setIsSpeakingState,
        isListening,
        selectedImage,
        setSelectedImage,
        isImageOpen,
        setIsImageOpen,
        activeAssistant,
        setActiveAssistant,
        inputMode,
        setInputMode,
        showDashboard,
        hackerModeActive,
        isGeneratingImage,
        handleImageGenerationFromPrompt
      }}
    >
      {children}
    </JarvisChatContext.Provider>
  );
};

export const useJarvisChat = () => {
  const context = useContext(JarvisChatContext);
  if (context === undefined) {
    throw new Error("useJarvisChat must be used within a JarvisChatProvider");
  }
  return context;
};
