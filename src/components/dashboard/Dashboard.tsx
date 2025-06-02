
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import NeuralNetworkPanel from "../ai/NeuralNetworkPanel";
import { toast } from '@/components/ui/sonner';
import { Button } from "../ui/button";
import VoiceAIPanel from "../voice/VoiceAIPanel";
import { MemoryPanel } from "../memory/MemoryPanel";
import PracticalDashboard from "./PracticalDashboard";
import AdvancedTools from "./AdvancedTools";
import JarvisProDashboard from "../jarvis-pro/JarvisProDashboard";

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

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-6 space-y-6">
        <Tabs defaultValue="jarvis-pro" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jarvis-pro">Jarvis Pro — Business Suite</TabsTrigger>
            <TabsTrigger value="advanced-tools">Advanced Tools</TabsTrigger>
            <TabsTrigger value="practical">Practical Dashboard</TabsTrigger>
            <TabsTrigger value="ai-systems">AI Systems</TabsTrigger>
          </TabsList>

          <TabsContent value="jarvis-pro" className="space-y-6">
            <JarvisProDashboard />
          </TabsContent>

          <TabsContent value="advanced-tools" className="space-y-6">
            <AdvancedTools />
          </TabsContent>

          <TabsContent value="practical" className="space-y-6">
            <PracticalDashboard />
          </TabsContent>

          <TabsContent value="ai-systems" className="space-y-6">
            {/* AI Systems and Neural Networks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NeuralNetworkPanel />
              <VoiceAIPanel />
            </div>
            
            <MemoryPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
