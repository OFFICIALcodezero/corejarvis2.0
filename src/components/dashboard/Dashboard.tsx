
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

  const [viewMode, setViewMode] = useState<'practical' | 'advanced'>('practical');

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

  // Show practical dashboard by default
  if (viewMode === 'practical') {
    return (
      <div className="min-h-screen bg-black">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('advanced')}
            className="bg-gray-900/50 border-green-500/30 text-green-400 hover:bg-gray-800 text-xs"
          >
            Advanced Mode
          </Button>
        </div>
        <PracticalDashboard />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 bg-black min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-400">Advanced Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode('practical')}
          className="bg-gray-900/50 border-green-500/30 text-green-400 hover:bg-gray-800"
        >
          Practical Mode
        </Button>
      </div>

      <Tabs defaultValue="neural" className="w-full">
        <TabsList className="bg-black/30 border-green-500/20 overflow-x-auto flex-wrap">
          <TabsTrigger value="neural" className="text-green-400">Neural Network</TabsTrigger>
          <TabsTrigger value="voice" className="text-green-400">Voice AI</TabsTrigger>
          <TabsTrigger value="memory" className="text-green-400">Memory</TabsTrigger>
          <TabsTrigger value="tasks" className="text-green-400">Active Tasks</TabsTrigger>
          <TabsTrigger value="system" className="text-green-400">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="neural" className="space-y-4 mt-2">
          <NeuralNetworkPanel />
        </TabsContent>
        <TabsContent value="voice" className="space-y-4 mt-2">
          <VoiceAIPanel />
        </TabsContent>
        <TabsContent value="memory" className="space-y-4 mt-2">
          <MemoryPanel />
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4 mt-2">
          <Card className="p-4 bg-gray-900/40 border-green-500/30">
            <div className="text-center text-gray-400">
              Active tasks will appear here
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="space-y-4 mt-2">
          <Card className="p-4 bg-gray-900/40 border-green-500/30">
            <div className="text-center text-gray-400">
              System diagnostics will appear here
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
