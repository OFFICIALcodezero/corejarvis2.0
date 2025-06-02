
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Startup from "./pages/Startup";
import JarvisInterface from "./pages/JarvisInterface";
import ImageGeneration from "./pages/ImageGeneration";
import VideoMaker from "./pages/VideoMaker";
import JarvisSettings from "./components/JarvisSettings";
import JarvisModeEnhancer from './components/JarvisModeEnhancer';
import { JarvisChatProvider } from "./contexts/JarvisChatProvider";
import ErrorBoundary from './components/ErrorBoundary';
import FeaturesOverview from "./pages/FeaturesOverview";
import SatelliteSurveillancePage from "./pages/SatelliteSurveillance";
import OSINTSearch from "./pages/OSINTSearch";
import { AuthProvider } from "./contexts/AuthContext";
import { WeatherContextProvider } from "./features/WeatherContext";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import JarvisModeSwitcher from "./components/JarvisModeSwitcher";
import JarvisV2Interface from "./pages/JarvisV2Interface";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <JarvisChatProvider>
          <WeatherContextProvider>
            <div className="app-container">
              <JarvisModeEnhancer>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/startup" element={<Startup />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/interface" element={<JarvisInterface />} />
                  <Route path="/jarvis" element={<JarvisInterface />} /> 
                  <Route path="/jarvis-v2" element={<JarvisV2Interface />} />
                  <Route path="/code-zero" element={<JarvisV2Interface />} />
                  <Route path="/ghost" element={<JarvisV2Interface />} />
                  <Route path="/image-generation" element={<ImageGeneration />} />
                  <Route path="/images" element={<ImageGeneration />} />
                  <Route path="/video-maker" element={<VideoMaker />} />
                  <Route path="/settings" element={<JarvisSettings />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/features" element={<FeaturesOverview />} />
                  <Route path="/satellite" element={<SatelliteSurveillancePage />} />
                  <Route path="/osint" element={<OSINTSearch />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </JarvisModeEnhancer>
            </div>
            <div style={{ position: 'fixed', bottom: '0', right: '0', zIndex: '1000' }}>
              <JarvisModeSwitcher />
            </div>
          </WeatherContextProvider>
        </JarvisChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
