
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import NeuralNetworkPanel from "../ai/NeuralNetworkPanel";
import { toast } from '@/components/ui/sonner';
import { Button } from "../ui/button";
import VoiceAIPanel from "../voice/VoiceAIPanel";
import { MemoryPanel } from "../memory/MemoryPanel";
import PracticalDashboard from "./PracticalDashboard";

const Dashboard: React.FC = () => {
  const [activeSystems, setActiveSystems] = useState({
    neural: true,
    quantum: false,
    conscious: false,
    legion: false
  });

  useEffect(() => {
    // Initial dashboard loaded notification
    toast("J.A.R.V.I.S. Dashboard Online", {
      description: "Personal AI assistant ready for commands.",
    });
  }, []);

  const handleActivateSystem = (system: string) => {
    setActiveSystems(prev => ({
      ...prev,
      [system]: true
    }));

    toast(`${system.charAt(0).toUpperCase() + system.slice(1)} System Activated`, {
      description: "New AI capabilities are now online."
    });
  };

  // Always show practical dashboard
  return (
    <div className="min-h-screen bg-black">
      <PracticalDashboard />
    </div>
  );
};

export default Dashboard;
