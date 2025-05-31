
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StartupSequence: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  // Enhanced startup sequence with NLP capabilities
  const startupLines = [
    "Initializing J.A.R.V.I.S. operating system...",
    "Core systems online...",
    "Loading memory modules...",
    "Calibrating neural networks...",
    "Initializing natural language processing...",
    "Loading contextual understanding model...",
    "Connecting to knowledge base...",
    "Loading multilingual response system...",
    "Voice synthesis calibration complete...",
    "Speech recognition activated...",
    "Conversational intelligence online...",
    "All systems nominal...",
    "J.A.R.V.I.S. is now fully operational."
  ];

  useEffect(() => {
    if (currentLine < startupLines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 300 + Math.random() * 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentLine]);

  return (
    <div className="h-screen bg-midnight flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none"></div>
      
      {/* Startup container */}
      <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md border border-jarvis/30 rounded-lg p-6 jarvis-panel">
        <div className="flex items-center mb-6">
          <div className="h-3 w-3 rounded-full bg-jarvis animate-pulse mr-3"></div>
          <h1 className="text-jarvis text-xl font-bold">JARVIS BOOT SEQUENCE</h1>
        </div>
        
        <div className="font-mono text-sm space-y-2 mb-6">
          {startupLines.slice(0, currentLine).map((line, index) => (
            <div 
              key={index} 
              className="flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-jarvis mr-2">{'>'}</span>
              <span className={index === currentLine - 1 ? 'text-jarvis' : 'text-gray-400'}>
                {line}
                {index === currentLine - 1 && !isComplete && (
                  <span className="inline-block h-4 w-1 bg-jarvis/80 ml-1 animate-pulse"></span>
                )}
              </span>
            </div>
          ))}
        </div>
        
        {isComplete && (
          <div className="text-center animate-fade-in">
            <div className="inline-block jarvis-panel py-2 px-4 rounded-full">
              <span className="text-jarvis">Ready to assist</span>
            </div>
          </div>
        )}
        
        {/* Loading progress */}
        <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-jarvis transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(100, (currentLine / startupLines.length) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StartupSequence;
