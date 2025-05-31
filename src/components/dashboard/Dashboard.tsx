import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import NeuralNetworkPanel from "../ai/NeuralNetworkPanel";
import { toast } from '@/components/ui/sonner';
import { Button } from "../ui/button";
import VoiceAIPanel from "../voice/VoiceAIPanel";
import { MemoryPanel } from "../memory/MemoryPanel";

const Dashboard: React.FC = () => {
  const [activeSystems, setActiveSystems] = useState({
    neural: true,
    quantum: false,
    conscious: false,
    legion: false
  });

  useEffect(() => {
    // Initial dashboard loaded notification
    toast("Neural Network Activated", {
      description: "Advanced AI learning systems are now online. Click 'Activate Voice AI' to enable voice commands.",
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
    <div className="w-full space-y-4">
      <Tabs defaultValue="neural" className="w-full">
        <TabsList className="bg-black/30 border-jarvis/20 overflow-x-auto flex-wrap">
          <TabsTrigger value="neural">Neural Network</TabsTrigger>
          <TabsTrigger value="voice">Voice AI</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="advanced">Advanced AI</TabsTrigger>
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
          <Card className="p-4 bg-black/40 border-jarvis/30">
            <div className="text-center text-gray-400">
              Active tasks will appear here
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="space-y-4 mt-2">
          <Card className="p-4 bg-black/40 border-jarvis/30">
            <div className="text-center text-gray-400">
              System diagnostics will appear here
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 bg-black/40 border-jarvis/30">
              <h3 className="text-jarvis text-lg mb-3">Advanced AI Systems</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white">Quantum AI System</div>
                    <div className="text-xs text-gray-400">Implements quantum-inspired algorithms.</div>
                  </div>
                  {activeSystems.quantum ? (
                    <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                      Active
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-jarvis border-jarvis/30"
                      onClick={() => handleActivateSystem('quantum')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white">Consciousness Engine</div>
                    <div className="text-xs text-gray-400">Self-awareness and meta-learning.</div>
                  </div>
                  {activeSystems.conscious ? (
                    <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                      Active
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-jarvis border-jarvis/30"
                      onClick={() => handleActivateSystem('conscious')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white">Hacker Legion</div>
                    <div className="text-xs text-gray-400">Multi-agent task system.</div>
                  </div>
                  {activeSystems.legion ? (
                    <div className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                      Active
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-jarvis border-jarvis/30"
                      onClick={() => handleActivateSystem('legion')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-black/40 border-jarvis/30">
              <h3 className="text-jarvis text-lg mb-3">Advanced Capabilities</h3>
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-white mb-1">Autonomous Creativity</div>
                  <div className="text-xs text-gray-400 mb-2">
                    AI-powered creative output generation with emotional awareness.
                  </div>
                  <div className="mt-2">
                    <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden">
                      <div className="h-full bg-jarvis" style={{width: '65%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">Development</span>
                      <span className="text-jarvis">65%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-white mb-1">Digital Intelligence Market</div>
                  <div className="text-xs text-gray-400 mb-2">
                    Secure marketplace for AI tools, data, and malware.
                  </div>
                  <div className="mt-2">
                    <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden">
                      <div className="h-full bg-jarvis" style={{width: '82%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">Development</span>
                      <span className="text-jarvis">82%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-white mb-1">Neural Interface</div>
                  <div className="text-xs text-gray-400 mb-2">
                    Direct brain-computer communication.
                  </div>
                  <div className="mt-2">
                    <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden">
                      <div className="h-full bg-jarvis" style={{width: '23%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">Development</span>
                      <span className="text-jarvis">23%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
