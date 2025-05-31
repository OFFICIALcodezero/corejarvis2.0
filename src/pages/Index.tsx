import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import JarvisAvatar from "@/components/JarvisAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Brain, Mic, HardDrive, Shield, Palette, Eye, Users, MessageCircle, Folder, Volume2, Terminal, Smartphone } from "lucide-react";
import "../styles/jarvis-home.css";

const Index = () => {
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Memory Engine",
      description: "Remembers conversations & preferences"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Interface",
      description: "Real-time voice interaction (ElevenLabs-powered)"
    },
    {
      icon: <HardDrive className="h-8 w-8" />,
      title: "Offline AI",
      description: "Learns from spoken data stored in /offlineAI"
    },
    {
      icon: <Terminal className="h-8 w-8" />,
      title: "Hacker Tools",
      description: "IP tracing, DNS lookup, OSINT, Tor, and Labs"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Private & Secure",
      description: "Supabase RLS, encrypted access"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Themes & Modes",
      description: "Synthwave, Dark Hacker, Minimal UI"
    }
  ];

  const statusItems = [
    { label: "Memory System", status: "Online", color: "bg-green-500" },
    { label: "Voice AI", status: "Ready", color: "bg-blue-500" },
    { label: "Learning Mode", status: "Active", color: "bg-purple-500" },
    { label: "Security", status: "End-to-End", color: "bg-red-500" },
    { label: "Realtime Activity", status: "42 Active Sessions", color: "bg-yellow-500" }
  ];

  const previewItems = [
    { title: "Dashboard", description: "Command center for all JARVIS operations" },
    { title: "Chat with Memory Logs", description: "Intelligent conversations with full context" },
    { title: "OfflineAI Folder", description: "Local learning and data processing" },
    { title: "Voice Assistant Live", description: "Real-time voice interaction" },
    { title: "Hacker Tools", description: "Advanced cyber intelligence suite" },
    { title: "Mobile App Interface", description: "JARVIS on the go" }
  ];

  const steps = [
    { number: "01", title: "Login or Register", description: "Create your secure JARVIS account" },
    { number: "02", title: "Talk to JARVIS", description: "Start conversing with your AI assistant" },
    { number: "03", title: "Teach it via chat/voice", description: "Train JARVIS with your preferences" },
    { number: "04", title: "Enable features", description: "Activate Memory, Hacker Mode, and more" },
    { number: "05", title: "Evolve it as your private AI", description: "Watch JARVIS grow with you" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-hidden matrix-bg">
      <Helmet>
        <title>JARVIS 2.0 - Your Personal AI Intelligence System</title>
        <meta name="description" content="Hyper-intelligent assistant with memory, offline learning, and voice control" />
      </Helmet>
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/3a6eccda-f035-4b67-a658-5a9ddf5ae6bd.png')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-b border-blue-500/20">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-400 glow">JARVIS 2.0</h1>
            <Badge variant="outline" className="border-blue-400 text-blue-400 neon-pulse">
              v2.0.1
            </Badge>
          </div>
          <div className="flex space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Register
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center scan-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 hologram-flicker">
              JARVIS 2.0
            </h2>
            <h3 className="text-3xl font-semibold mb-4 text-gray-300">
              Your Personal AI Intelligence System
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto data-stream">
              Hyper-intelligent assistant with memory, offline learning, and voice control.
            </p>
            
            <div className="flex justify-center mb-12">
              <div className="neon-pulse">
                <JarvisAvatar 
                  activeMode="face"
                  isSpeaking={false}
                  isListening={false}
                  isProcessing={false}
                />
              </div>
            </div>

            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 glow">
                → Launch JARVIS
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400 glow">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 transition-colors cyber-border">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-400 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Status Section */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400 glow">System Status</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {statusItems.map((item, index) => (
              <Card key={index} className="bg-black/50 border border-gray-700 cyber-border">
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color} animate-pulse`}></div>
                  <div>
                    <div className="text-white font-medium">{item.label}</div>
                    <div className="text-gray-400 text-sm">{item.status}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Preview Carousel Section */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400 glow">Preview JARVIS in Action</h3>
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {previewItems.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 cyber-border">
                    <CardContent className="p-6">
                      <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center neon-pulse">
                        <Eye className="h-12 w-12 text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400 glow">How It Works</h3>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6 mb-8">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold neon-pulse">
                  {step.number}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About the Developer Section */}
        <section className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-blue-400 glow">👨‍💻 About the Developer</h3>
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-blue-500/30 cyber-border">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-6xl mb-4 hologram-flicker">🐺</div>
                <h4 className="text-2xl font-bold text-white mb-4">Nakul Yadav</h4>
                <p className="text-lg text-blue-400 mb-6 glow">Also known as <span className="font-bold">Code Zero</span></p>
                <div className="text-gray-300 space-y-4 max-w-2xl mx-auto">
                  <p>
                    Hey, I'm a 15-year-old hacker, coder, and gamer with a passion for building intelligent systems.
                  </p>
                  <p>
                    I created Jarvis as my ultimate AI assistant: a fusion of powerful hacking tools, smart automation, voice control, and extreme customization. Whether I'm writing code, gaming, or exploring the limits of cyber intelligence, I push boundaries every day.
                  </p>
                  <p className="text-blue-400 font-semibold glow">
                    Jarvis is more than an assistant — it's my digital alter ego.
                  </p>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hologram-flicker">
                    Welcome to my world. 🐺
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Login Panel */}
        <section className="container mx-auto px-6 py-16">
          <Card className="max-w-md mx-auto bg-black/50 backdrop-blur-sm border border-blue-500/30 cyber-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-6 glow">Ready to Begin?</h3>
              <div className="space-y-4">
                <Link to="/auth" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 neon-pulse">
                    Login to JARVIS
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 font-semibold py-3">
                    Register
                  </Button>
                </Link>
                <div className="text-sm text-gray-400 mt-4">
                  Google and GitHub Login available
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-500/20 py-12">
          <div className="container mx-auto px-6 text-center">
            <div className="text-gray-400 space-y-2">
              <p>📜 <Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link> | <Link to="/terms" className="hover:text-blue-400">Terms of Use</Link></p>
              <p>🧠 JARVIS 2.0 is an independent AI assistant with memory, security & voice intelligence.</p>
              <p>🌍 Made for private users, devs, and power-hackers.</p>
              <p>📧 Contact: <a href="mailto:jarvis@yourdomain.com" className="text-blue-400 hover:underline">jarvis@yourdomain.com</a></p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
