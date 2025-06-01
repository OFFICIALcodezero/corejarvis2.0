
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Brain, 
  Mic, 
  FolderOpen, 
  Shield, 
  Lock, 
  Palette,
  Activity,
  Zap,
  Users,
  ArrowRight,
  Github,
  Globe,
  Code,
  Terminal,
  Gamepad2
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState(1247);

  useEffect(() => {
    // Simulate real-time active user count
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  const features = [
    {
      icon: "🧠",
      title: "Memory Engine",
      description: "Remembers conversations & preferences"
    },
    {
      icon: "🎤",
      title: "Voice Interface", 
      description: "Real-time voice interaction (ElevenLabs-powered)"
    },
    {
      icon: "📁",
      title: "Offline AI",
      description: "Learns from spoken data stored in /offlineAI"
    },
    {
      icon: "👾",
      title: "Hacker Tools",
      description: "IP tracing, DNS lookup, OSINT, Tor, and Labs"
    },
    {
      icon: "🔐",
      title: "Private & Secure",
      description: "Supabase RLS, encrypted access"
    },
    {
      icon: "🎨",
      title: "Themes & Modes",
      description: "Synthwave, Dark Hacker, Minimal UI"
    }
  ];

  const statusItems = [
    { label: "Memory System", status: "Online", color: "bg-green-500" },
    { label: "Voice AI", status: "Ready", color: "bg-blue-500" },
    { label: "Learning Mode", status: "Active", color: "bg-purple-500" },
    { label: "Security", status: "End-to-End", color: "bg-red-500" }
  ];

  const previewItems = [
    { title: "Dashboard", description: "Complete AI control center" },
    { title: "Chat with Memory", description: "Intelligent conversations with context" },
    { title: "OfflineAI Folder", description: "Local learning and data storage" },
    { title: "Voice Assistant", description: "Real-time voice interactions" },
    { title: "Hacker Tools", description: "Advanced security and OSINT" },
    { title: "Mobile Interface", description: "Cross-platform accessibility" }
  ];

  const steps = [
    { number: "01", title: "Login or Register", description: "Create your secure JARVIS account" },
    { number: "02", title: "Talk to JARVIS", description: "Start conversing with your AI assistant" },
    { number: "03", title: "Teach via Chat/Voice", description: "Train JARVIS with your preferences" },
    { number: "04", title: "Enable Features", description: "Activate Memory, Hacker Mode, and more" },
    { number: "05", title: "Evolve Your AI", description: "Watch JARVIS become your perfect assistant" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      <Helmet>
        <title>JARVIS 2.0 - Your Personal AI Intelligence System</title>
        <meta name="description" content="Hyper-intelligent assistant with memory, offline learning, and voice control" />
      </Helmet>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/3a6eccda-f035-4b67-a658-5a9ddf5ae6bd.png')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-red-600/10" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-b border-blue-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-blue-400 glow">JARVIS 2.0</h1>
          </div>
          <nav className="flex space-x-4">
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
            >
              Launch JARVIS
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 animate-pulse">
              JARVIS 2.0
            </h2>
            <h3 className="text-3xl font-semibold mb-4 text-gray-300">
              Your Personal AI Intelligence System
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Hyper-intelligent assistant with memory, offline learning, and voice control.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Launch JARVIS
            </Link>
          </div>
        </section>

        {/* Live Status Section */}
        <section className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {statusItems.map((item, index) => (
              <Badge key={index} className="px-4 py-2 bg-black/40 border border-blue-500/30">
                <div className={`w-2 h-2 rounded-full ${item.color} mr-2 animate-pulse`}></div>
                {item.label}: {item.status}
              </Badge>
            ))}
            <Badge className="px-4 py-2 bg-black/40 border border-green-500/30">
              <Activity className="w-3 h-3 mr-2" />
              Active Users: {activeUsers.toLocaleString()}
            </Badge>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/40 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-blue-400 mb-2">{feature.title}</h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Preview Carousel */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400">Preview JARVIS 2.0</h3>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {previewItems.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-black/40 border-blue-500/30">
                    <CardContent className="p-6">
                      <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
                        <Terminal className="w-12 h-12 text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">{item.title}</h4>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400">How It Works</h3>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center mb-8 last:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mr-6 flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-blue-400 mb-2">{step.title}</h4>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Developer Section */}
        <section className="container mx-auto px-6 py-16">
          <Card className="bg-black/40 border-red-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-center mb-6 text-red-400">👨‍💻 About the Developer</h3>
              <div className="text-center">
                <p className="text-lg text-gray-300 mb-4">
                  Hey, I'm <span className="text-red-400 font-bold">Nakul Yadav</span>, also known in the digital world as <span className="text-red-400 font-bold">Code Zero</span> — a 15-year-old hacker, coder, and gamer with a passion for building intelligent systems.
                </p>
                <p className="text-lg text-gray-300 mb-4">
                  I created Jarvis as my ultimate AI assistant: a fusion of powerful hacking tools, smart automation, voice control, and extreme customization. Whether I'm writing code, gaming, or exploring the limits of cyber intelligence, I push boundaries every day.
                </p>
                <p className="text-lg text-gray-300 mb-6">
                  Jarvis is more than an assistant — it's my digital alter ego.
                </p>
                <p className="text-xl font-bold text-red-400">Welcome to my world. 🐺</p>
                <div className="flex justify-center space-x-4 mt-6">
                  <Code className="w-8 h-8 text-blue-400" />
                  <Terminal className="w-8 h-8 text-green-400" />
                  <Gamepad2 className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Login Panel */}
        <section className="container mx-auto px-6 py-16">
          <Card className="bg-black/40 border-blue-500/30 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">Access JARVIS 2.0</h3>
              <div className="space-y-4">
                <Link to="/auth">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Login to JARVIS
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    Register
                  </Button>
                </Link>
                <div className="text-sm text-gray-400 mt-4">
                  Quick access with Google & GitHub
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-500/20 py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-wrap justify-center items-center space-x-6 mb-4 text-sm text-gray-400">
              <span>📜 Privacy Policy</span>
              <span>|</span>
              <span>Terms of Use</span>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>🧠 JARVIS 2.0 is an independent AI assistant with memory, security & voice intelligence.</p>
              <p>🌍 Made for private users, devs, and power-hackers.</p>
              <p>📧 Contact: jarvis@yourdomain.com</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
