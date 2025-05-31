
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import StartupSequence from "@/components/StartupSequence";

const Startup = () => {
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        if (user) {
          navigate("/dashboard");
        } else {
          navigate("/auth");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isComplete, navigate, user]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black" />
      
      <div className="relative z-10 text-center">
        <StartupSequence />
        
        {isComplete && (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-2xl text-blue-400 mb-4">
              System Initialization Complete
            </h2>
            {user ? (
              <p className="text-gray-300">
                Welcome back, {user.email}. Redirecting to dashboard...
              </p>
            ) : (
              <p className="text-gray-300">
                Redirecting to authentication...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Startup;
