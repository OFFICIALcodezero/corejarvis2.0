
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Main: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
      <h1 className="text-4xl font-bold text-jarvis mb-6">JARVIS</h1>
      <p className="mb-8 max-w-md">Welcome to the JARVIS AI System. Please authenticate to continue.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/auth')} className="bg-jarvis hover:bg-jarvis/80">
          Login / Sign Up
        </Button>
        <Button variant="outline" onClick={() => navigate('/interface')} className="border-jarvis text-jarvis hover:bg-jarvis/10">
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};

export default Main;
