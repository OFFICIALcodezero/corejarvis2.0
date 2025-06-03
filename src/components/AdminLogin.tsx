
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { AdminAuthService } from '@/services/adminAuthService';
import { toast } from './ui/use-toast';
import { Lock, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Login attempt for username:', username);

    try {
      // Simulate loading time for security
      await new Promise(resolve => setTimeout(resolve, 800));

      const success = await AdminAuthService.authenticate(username, password);
      
      if (success) {
        console.log('Login successful');
        toast({
          title: "Admin Access Granted",
          description: "Welcome to JARVIS Admin Panel",
        });
        onLoginSuccess();
      } else {
        console.log('Login failed');
        toast({
          title: "Access Denied",
          description: "Invalid credentials. Use 'admin' / 'admin123' for demo access.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Clear password field for security
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 border-red-500/30 backdrop-blur-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-red-400 text-2xl">JARVIS Admin Access</CardTitle>
          <p className="text-gray-400">Restricted Area - Authorized Personnel Only</p>
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-800/50 rounded">
            Demo Credentials: admin / admin123
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-red-400">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-900/50 border-red-500/30 text-white"
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-red-400">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900/50 border-red-500/30 text-white"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
