
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Cpu, Brain, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SystemStatus {
  id: string;
  system_name: string;
  is_active: boolean;
  updated_at: string;
}

const AdvancedTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [systemsStatus, setSystemsStatus] = useState<SystemStatus[]>([]);
  const [activatingSystem, setActivatingSystem] = useState<string | null>(null);
  const { user } = useAuth();

  const systems = [
    {
      id: 'quantum-ai',
      name: 'Quantum AI',
      icon: <Cpu className="h-8 w-8" />,
      color: 'from-cyan-400 to-blue-500',
      endpoint: 'activate-quantum'
    },
    {
      id: 'consciousness-engine',
      name: 'Conscious Engine',
      icon: <Brain className="h-8 w-8" />,
      color: 'from-purple-400 to-pink-500',
      endpoint: 'start-consciousness-engine'
    },
    {
      id: 'hacker-legion',
      name: 'Hacker Legion',
      icon: <Users className="h-8 w-8" />,
      color: 'from-red-400 to-orange-500',
      endpoint: 'activate-legion'
    }
  ];

  useEffect(() => {
    fetchSystemsStatus();
  }, []);

  const fetchSystemsStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('systems_status')
        .select('*')
        .order('system_name');

      if (error) {
        console.error('Error fetching systems status:', error);
        return;
      }

      setSystemsStatus(data || []);
    } catch (error) {
      console.error('Error fetching systems status:', error);
    }
  };

  const activateSystem = async (systemId: string, endpoint: string) => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to activate systems'
      });
      return;
    }

    setActivatingSystem(systemId);

    try {
      const { data, error } = await supabase.functions.invoke(endpoint, {
        method: 'POST'
      });

      if (error) {
        throw error;
      }

      // Show success toast with glowing effect
      toast.success('System Activated', {
        description: data.message,
        className: 'border-green-500/50 bg-green-950/20 text-green-100'
      });

      // Refresh systems status
      await fetchSystemsStatus();

    } catch (error) {
      console.error('Error activating system:', error);
      toast.error('Activation Failed', {
        description: 'Failed to activate system. Please try again.',
        className: 'border-red-500/50 bg-red-950/20 text-red-100'
      });
    } finally {
      setActivatingSystem(null);
    }
  };

  const getSystemStatus = (systemId: string) => {
    return systemsStatus.find(s => s.system_name === systemId);
  };

  return (
    <Card className="border-jarvis/30 bg-black/20 backdrop-blur-sm overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-jarvis/5 transition-colors">
            <CardTitle className="flex items-center justify-between text-jarvis">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6" />
                <span>Advanced Tools</span>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {systems.map((system) => {
                const status = getSystemStatus(system.id);
                const isActive = status?.is_active || false;
                const isActivating = activatingSystem === system.id;

                return (
                  <div
                    key={system.id}
                    className={`
                      relative p-6 rounded-xl border-2 backdrop-blur-sm transition-all duration-300
                      ${isActive 
                        ? 'border-green-400/50 bg-green-900/20 shadow-lg shadow-green-400/20' 
                        : 'border-gray-600/30 bg-gray-900/20 hover:border-jarvis/40'
                      }
                      ${isActivating ? 'animate-pulse' : ''}
                    `}
                  >
                    {/* Glow effect for active systems */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-emerald-400/10 animate-pulse" />
                    )}
                    
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${system.color} text-white`}>
                        {system.icon}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {system.name}
                        </h3>
                        
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                          <span className={`text-sm ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => activateSystem(system.id, system.endpoint)}
                        disabled={isActivating || isActive}
                        className={`
                          w-full relative overflow-hidden transition-all duration-300
                          ${isActive 
                            ? 'bg-green-600/50 text-green-100 border-green-400/50' 
                            : 'bg-gradient-to-r from-jarvis/20 to-jarvis/30 hover:from-jarvis/30 hover:to-jarvis/40 border-jarvis/40 text-jarvis'
                          }
                          ${isActivating ? 'animate-pulse' : ''}
                        `}
                        variant="outline"
                      >
                        {isActivating && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        )}
                        <span className="relative">
                          {isActivating ? 'Activating...' : isActive ? 'Active' : 'Activate'}
                        </span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Status indicator */}
            <div className="mt-6 p-4 rounded-lg bg-black/30 border border-jarvis/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">System Status:</span>
                <span className="text-jarvis">
                  {systemsStatus.filter(s => s.is_active).length} of {systemsStatus.length} systems active
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AdvancedTools;
