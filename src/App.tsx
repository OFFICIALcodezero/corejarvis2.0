
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import pages
import Index from "./pages/Index";
import JarvisInterface from "./pages/JarvisInterface";
import JarvisV2Interface from "./pages/JarvisV2Interface";
import Auth from "./pages/Auth";
import MainPage from "./pages/Main";
import ImageGeneration from "./pages/ImageGeneration";
import SatelliteSurveillance from "./pages/SatelliteSurveillance";
import FeaturesOverview from "./pages/FeaturesOverview";
import OSINTSearch from "./pages/OSINTSearch";
import VideoMaker from "./pages/VideoMaker";
import AdminPanel from "./pages/AdminPanel";
import Startup from "./pages/Startup";
import NotFound from "./pages/NotFound";
import JarvisProDashboard from "./pages/JarvisProDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/interface" element={<JarvisInterface />} />
                <Route path="/v2" element={<JarvisV2Interface />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/image-generation" element={<ImageGeneration />} />
                <Route path="/satellite" element={<SatelliteSurveillance />} />
                <Route path="/features" element={<FeaturesOverview />} />
                <Route path="/osint" element={<OSINTSearch />} />
                <Route path="/video-maker" element={<VideoMaker />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/startup" element={<Startup />} />
                <Route path="/dashboard" element={<JarvisProDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
