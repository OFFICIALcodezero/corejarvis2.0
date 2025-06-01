import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import JarvisAvatar from "@/components/JarvisAvatar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <Helmet>
        <title>JARVIS - Just A Rather Very Intelligent System</title>
        <meta name="description" content="Advanced AI Assistant Interface" />
      </Helmet>
      
      <div className="absolute inset-0 bg-[url('/lovable-uploads/3a6eccda-f035-4b67-a658-5a9ddf5ae6bd.png')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10">
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400 glow">JARVIS</h1>
          <nav className="space-x-4">
            {user ? (
              <>
                <span className="text-blue-300">Welcome, {user.email}</span>
                <Link
                  to="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
              Just A Rather Very Intelligent System
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of AI assistance with advanced capabilities, 
              real-time communication, and seamless integration.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <JarvisAvatar 
              activeMode="face"
              isSpeaking={false}
              isListening={false}
              isProcessing={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/50 transition-colors">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">AI Chat Interface</h3>
              <p className="text-gray-300">Communicate with advanced AI in real-time with natural language processing.</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/50 transition-colors">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Task Management</h3>
              <p className="text-gray-300">Organize and track your tasks with intelligent prioritization and scheduling.</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/50 transition-colors">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">File Management</h3>
              <p className="text-gray-300">Secure cloud storage with advanced file organization and sharing capabilities.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Access Dashboard
              </Link>
            ) : (
              <Link
                to="/auth"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
