
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, Info } from "lucide-react";

const JarvisSettings: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              System Configuration
            </CardTitle>
            <CardDescription>
              JARVIS system settings and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-blue-500/10 border-blue-500/30">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                All API keys and system configurations are managed centrally by your administrator. 
                You can use all JARVIS features without any additional setup.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-green-500/10 border-green-500/30">
              <Shield className="h-4 w-4 text-green-500" />
              <AlertDescription>
                JARVIS AI services are fully configured and operational. 
                Enjoy seamless AI-powered assistance across all features.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JarvisSettings;
