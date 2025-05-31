
import React from "react";
import JarvisDashboard from "@/components/JarvisDashboard";
import { JarvisChatProvider } from "@/contexts/JarvisChatProvider";

interface ChatDashboardPanelProps {
  messages?: any[];
  isTyping?: boolean;
}

const ChatDashboardPanel: React.FC<ChatDashboardPanelProps> = ({ messages, isTyping }) => {
  // Dashboard panel - completely text-only, no voice/mic functionality
  return (
    <div className="p-3 bg-black/20 border-b border-jarvis/20">
      <ErrorBoundaryWrapper>
        <JarvisChatProvider>
          <JarvisDashboard />
        </JarvisChatProvider>
      </ErrorBoundaryWrapper>
    </div>
  );
};

// Simple error boundary wrapper component to prevent the entire UI from crashing
const ErrorBoundaryWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Reset error state on component mount
    setHasError(false);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-black/30 rounded-md">
        <p className="text-amber-400">Dashboard component unavailable.</p>
      </div>
    );
  }

  // Try to render the dashboard, but catch errors
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    setHasError(true);
    return (
      <div className="p-4 bg-black/30 rounded-md">
        <p className="text-amber-400">Dashboard component unavailable.</p>
      </div>
    );
  }
};

export default ChatDashboardPanel;
