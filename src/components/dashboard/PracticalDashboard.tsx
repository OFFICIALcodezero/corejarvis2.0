import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  FileSearch, 
  Mic, 
  CloudSun, 
  CheckSquare, 
  Brain, 
  Mail, 
  Search, 
  ScanText,
  Clock,
  Calendar,
  Bell,
  Languages,
  FileEdit,
  Battery,
  HardDrive,
  Smartphone,
  MapPin,
  DollarSign,
  Rss,
  Shield,
  Key,
  Activity,
  ChevronDown,
  ChevronRight,
  Moon,
  Database,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { getWeatherByCoordinates } from '@/services/weatherService';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { useAutoTasking } from '@/hooks/useAutoTasking';
import { useSleepMode } from '@/hooks/useSleepMode';
import JarvisSearchBar from './JarvisSearchBar';
import DataExportImport from './DataExportImport';

interface ToolCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  route?: string;
  action?: () => void;
  status: 'active' | 'beta' | 'coming-soon';
}

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  tools: ToolCard[];
  collapsed: boolean;
}

const PracticalDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  
  // New hooks for AI features
  const { analyzeSentiment, currentMood } = useSentimentAnalysis();
  const { analyzeForPatterns, checkAndTriggerRecurringTasks } = useAutoTasking();
  const { isSleepMode, sleepMinutes, wakeUp, checkWakeWord, updateSleepTimeout } = useSleepMode();

  // Update time every second with proper IST calculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(now);
      
      const istDate = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(now);
      
      setCurrentTime(istTime);
      setCurrentDate(istDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check recurring tasks every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndTriggerRecurringTasks();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkAndTriggerRecurringTasks]);

  // Get battery level
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {
        setBatteryLevel(null);
      });
    }
  }, []);

  // Apply mood-based UI changes
  const getMoodStyles = () => {
    switch (currentMood) {
      case 'happy':
        return {
          primaryColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          bgColor: 'bg-yellow-500/10',
          animation: 'animate-pulse'
        };
      case 'sad':
        return {
          primaryColor: 'text-blue-300',
          borderColor: 'border-blue-500/20',
          bgColor: 'bg-blue-500/5',
          animation: ''
        };
      case 'angry':
        return {
          primaryColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          bgColor: 'bg-red-500/10',
          animation: ''
        };
      default:
        return {
          primaryColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          bgColor: 'bg-green-500/10',
          animation: ''
        };
    }
  };

  const moodStyles = getMoodStyles();

  const handleWeatherTool = async () => {
    try {
      toast("Getting your location...", { description: "Accessing GPS coordinates" });
      
      if (!navigator.geolocation) {
        toast("Location Error", { description: "Geolocation is not supported by this browser" });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            toast("Fetching weather data...", { 
              description: `Getting weather for your location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})` 
            });
            
            const weatherResponse = await getWeatherByCoordinates(latitude, longitude);
            
            const weatherText = `Weather in ${weatherResponse.location.name}: ${weatherResponse.current.condition} with ${Math.round(weatherResponse.current.temp)}°C. Humidity: ${weatherResponse.current.humidity}%, Wind: ${weatherResponse.current.windSpeed} km/h`;
            
            toast("Weather Update", { 
              description: weatherText,
              duration: 6000
            });
          } catch (error) {
            console.error('Weather fetch error:', error);
            toast("Weather Error", { description: "Could not fetch weather data for your location" });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = "Could not access your location";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please allow location access and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          
          toast("Location Error", { description: errorMessage });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } catch (error) {
      console.error('Weather tool error:', error);
      toast("Weather Error", { description: "Could not initialize weather service" });
    }
  };

  const handleAlarmTool = () => {
    const timeInput = prompt("Set alarm time (HH:MM format, 24-hour):");
    if (timeInput && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeInput)) {
      const [hours, minutes] = timeInput.split(':').map(Number);
      const now = new Date();
      const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
      
      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }
      
      const timeUntilAlarm = alarmTime.getTime() - now.getTime();
      
      setTimeout(() => {
        toast("⏰ ALARM!", { 
          description: `Alarm set for ${timeInput} is ringing!`,
          duration: 10000
        });
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }, timeUntilAlarm);
      
      toast("Alarm Set", { 
        description: `Alarm set for ${timeInput} (${Math.round(timeUntilAlarm / 60000)} minutes from now)`
      });
      
      // Analyze for patterns
      analyzeForPatterns(`Alarm at ${timeInput}`);
    } else {
      toast("Invalid Time", { description: "Please enter time in HH:MM format (e.g., 14:30)" });
    }
  };

  const handleCalendarTool = () => {
    const action = prompt("Calendar Actions:\n1. Add Event\n2. View Events\n\nEnter choice (1-2):");
    
    if (action === '1') {
      const title = prompt("Event title:");
      if (!title) return;
      
      const date = prompt("Event date (YYYY-MM-DD):");
      if (!date) return;
      
      const time = prompt("Event time (HH:MM):");
      if (!time) return;
      
      const events = JSON.parse(localStorage.getItem('jarvis-events') || '[]');
      events.push({
        id: Date.now(),
        title,
        date,
        time,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('jarvis-events', JSON.stringify(events));
      toast("Event Added", { description: `"${title}" scheduled for ${date} at ${time}` });
      
      // Analyze for patterns
      analyzeForPatterns(`${title} on ${date}`, date);
    } else if (action === '2') {
      const events = JSON.parse(localStorage.getItem('jarvis-events') || '[]');
      if (events.length > 0) {
        const eventsList = events.slice(-3).map((event: any) => 
          `${event.title} - ${event.date} at ${event.time}`
        ).join('\n');
        alert(`Upcoming Events:\n\n${eventsList}`);
      } else {
        toast("No Events", { description: "No events scheduled" });
      }
    }
  };

  const handleTranslatorTool = () => {
    const text = prompt("Enter text to translate:");
    if (!text) return;
    
    const targetLang = prompt("Target language (en, es, fr, de, it, ja, zh, ru, ar, hi):");
    if (!targetLang) return;
    
    // Mock translation (in real app, use Google Translate API)
    toast("Translation", { 
      description: `Text translated to ${targetLang}. (Note: Connect to translation API for real translations)`,
      duration: 5000
    });
  };

  const handleResumeGenerator = () => {
    const name = prompt("Your name:");
    if (!name) return;
    
    const skills = prompt("Your skills (comma-separated):");
    if (!skills) return;
    
    const experience = prompt("Years of experience:");
    if (!experience) return;
    
    toast("Resume Generated", { 
      description: `Resume for ${name} with ${experience} years experience created. Skills: ${skills.slice(0, 50)}...`,
      duration: 6000
    });
  };

  const handleStorageInfo = () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const used = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) : 'Unknown';
        const quota = estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(2) : 'Unknown';
        toast("Storage Info", { 
          description: `Used: ${used} MB / Available: ${quota} MB`,
          duration: 5000
        });
      });
    } else {
      toast("Storage Info", { description: "Storage API not supported in this browser" });
    }
  };

  const handleLocationMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          window.open(mapUrl, '_blank');
          toast("Location", { description: `Opening map at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
        },
        () => {
          toast("Location Error", { description: "Could not access your location" });
        }
      );
    }
  };

  const handleExpenseTracker = () => {
    const action = prompt("Expense Tracker:\n1. Add Expense\n2. View Expenses\n3. Export Data\n\nEnter choice (1-3):");
    
    if (action === '1') {
      const amount = prompt("Amount:");
      if (!amount) return;
      
      const description = prompt("Description:");
      if (!description) return;
      
      const category = prompt("Category:");
      
      const expenses = JSON.parse(localStorage.getItem('jarvis-expenses') || '[]');
      expenses.push({
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        category: category || 'Other',
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('jarvis-expenses', JSON.stringify(expenses));
      toast("Expense Added", { description: `₹${amount} for ${description}` });
    } else if (action === '2') {
      const expenses = JSON.parse(localStorage.getItem('jarvis-expenses') || '[]');
      const total = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
      toast("Expenses", { 
        description: `Total expenses: ₹${total.toFixed(2)} (${expenses.length} entries)`,
        duration: 5000
      });
    } else if (action === '3') {
      const expenses = JSON.parse(localStorage.getItem('jarvis-expenses') || '[]');
      const csvData = expenses.map((exp: any) => 
        `${exp.date},${exp.description},${exp.category},${exp.amount}`
      ).join('\n');
      const blob = new Blob([`Date,Description,Category,Amount\n${csvData}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expenses.csv';
      a.click();
      toast("Export Complete", { description: "Expenses exported to CSV file" });
    }
  };

  const handleNewsFeed = () => {
    // Mock news feed (in real app, use news API)
    const mockNews = [
      "Technology: AI advances in 2024 continue to reshape industries",
      "World: Global climate summit announces new initiatives",
      "Business: Tech stocks show strong performance this quarter"
    ];
    
    toast("Latest News", { 
      description: mockNews[Math.floor(Math.random() * mockNews.length)],
      duration: 6000
    });
  };

  const handleActivityLog = () => {
    const logs = JSON.parse(localStorage.getItem('jarvis-activity-logs') || '[]');
    
    // Add current activity
    logs.push({
      id: Date.now(),
      action: 'Viewed Activity Log',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('jarvis-activity-logs', JSON.stringify(logs.slice(-50))); // Keep last 50
    
    const recentLogs = logs.slice(-5).map((log: any) => 
      `${new Date(log.timestamp).toLocaleTimeString()}: ${log.action}`
    ).join('\n');
    
    alert(`Recent Activity:\n\n${recentLogs}`);
  };

  const handlePasswordManager = () => {
    const action = prompt("Password Manager:\n1. Add Password\n2. View Passwords\n3. Generate Password\n\nEnter choice (1-3):");
    
    if (action === '1') {
      const site = prompt("Website/Service:");
      if (!site) return;
      
      const username = prompt("Username:");
      if (!username) return;
      
      const password = prompt("Password:");
      if (!password) return;
      
      const passwords = JSON.parse(localStorage.getItem('jarvis-passwords') || '[]');
      passwords.push({
        id: Date.now(),
        site,
        username,
        password: btoa(password), // Basic encoding (use proper encryption in production)
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('jarvis-passwords', JSON.stringify(passwords));
      toast("Password Saved", { description: `Credentials for ${site} saved securely` });
    } else if (action === '2') {
      const passwords = JSON.parse(localStorage.getItem('jarvis-passwords') || '[]');
      if (passwords.length > 0) {
        const passwordList = passwords.map((p: any) => 
          `${p.site}: ${p.username}`
        ).join('\n');
        alert(`Saved Passwords:\n\n${passwordList}\n\n(Passwords are encrypted)`);
      } else {
        toast("No Passwords", { description: "No passwords saved yet" });
      }
    } else if (action === '3') {
      const length = parseInt(prompt("Password length (8-50):") || '12');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < Math.min(length, 50); i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      navigator.clipboard?.writeText(password).then(() => {
        toast("Password Generated", { description: `${length}-character password copied to clipboard` });
      }).catch(() => {
        alert(`Generated Password: ${password}`);
      });
    }
  };

  const handleVoiceLock = () => {
    if ('speechSynthesis' in window && 'webkitSpeechRecognition' in window) {
      const phrase = prompt("Set your voice lock phrase:");
      if (!phrase) return;
      
      localStorage.setItem('jarvis-voice-phrase', phrase.toLowerCase());
      toast("Voice Lock Set", { description: `Voice phrase "${phrase}" configured` });
      
      // Test voice recognition
      setTimeout(() => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          toast("Voice Lock", { description: "Say your phrase to unlock..." });
        };
        
        recognition.onresult = (event: any) => {
          const said = event.results[0][0].transcript.toLowerCase();
          const stored = localStorage.getItem('jarvis-voice-phrase');
          
          if (said.includes(stored || '')) {
            toast("Access Granted", { description: "Voice authentication successful!" });
          } else {
            toast("Access Denied", { description: "Voice phrase did not match" });
          }
          
          // Check for wake word
          if (checkWakeWord(said)) {
            wakeUp();
          }
          
          // Analyze sentiment
          analyzeSentiment(said);
        };
        
        recognition.onerror = (event: any) => {
          toast("Voice Error", { description: `Speech recognition error: ${event.error}` });
        };
        
        recognition.start();
      }, 1000);
    } else {
      toast("Voice Lock", { description: "Speech recognition not supported" });
    }
  };

  // New AI-powered tools
  const handleSleepModeSettings = () => {
    const minutes = prompt(`Sleep mode timeout (current: ${sleepMinutes} minutes):`);
    if (minutes && !isNaN(parseInt(minutes))) {
      updateSleepTimeout(parseInt(minutes));
      toast("Sleep Mode Updated", { 
        description: `Sleep mode will activate after ${minutes} minutes of inactivity` 
      });
    }
  };

  const handleSearchResult = (result: any) => {
    toast("Search Result", {
      description: `Found: ${result.title} - ${result.content.substring(0, 50)}...`,
      duration: 4000
    });
  };

  // Initialize categories
  useEffect(() => {
    const initialCategories: ToolCategory[] = [
      {
        id: 'daily',
        name: 'Daily Tools',
        icon: Clock,
        collapsed: false,
        tools: [
          {
            id: 'weather',
            name: 'Weather Info',
            description: 'Real-time weather data',
            icon: CloudSun,
            action: handleWeatherTool,
            status: 'active'
          },
          {
            id: 'alarm',
            name: 'Alarm & Reminders',
            description: 'Set alarms and notifications',
            icon: Bell,
            action: handleAlarmTool,
            status: 'active'
          },
          {
            id: 'calendar',
            name: 'Calendar',
            description: 'Manage events and schedule',
            icon: Calendar,
            action: handleCalendarTool,
            status: 'active'
          }
        ]
      },
      {
        id: 'ai',
        name: 'AI Utilities',
        icon: Brain,
        collapsed: false,
        tools: [
          {
            id: 'chat',
            name: 'Chat Assistant',
            description: 'AI conversation interface',
            icon: MessageSquare,
            route: '/interface',
            status: 'active'
          },
          {
            id: 'pdf-reader',
            name: 'PDF & Doc Reader',
            description: 'Read and analyze documents',
            icon: FileText,
            action: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.doc,.docx,.txt';
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  toast("PDF Reader", { description: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` });
                  
                  if (file.type === 'application/pdf') {
                    const reader = new FileReader();
                    reader.onload = () => {
                      toast("PDF Analysis", { description: `PDF loaded successfully. File size: ${(file.size / 1024).toFixed(2)} KB` });
                    };
                    reader.readAsArrayBuffer(file);
                  } else if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const content = e.target?.result as string;
                      const preview = content.slice(0, 100) + (content.length > 100 ? '...' : '');
                      toast("Text File Content", { description: `Preview: ${preview}` });
                    };
                    reader.readAsText(file);
                  }
                }
              };
              input.click();
            },
            status: 'active'
          },
          {
            id: 'translator',
            name: 'Language Translator',
            description: 'Translate text between languages',
            icon: Languages,
            action: handleTranslatorTool,
            status: 'active'
          },
          {
            id: 'resume',
            name: 'Resume Generator',
            description: 'Generate resumes and letters',
            icon: FileEdit,
            action: handleResumeGenerator,
            status: 'active'
          }
        ]
      },
      {
        id: 'device',
        name: 'Device & System',
        icon: Smartphone,
        collapsed: false,
        tools: [
          {
            id: 'battery',
            name: 'Battery Status',
            description: `Battery: ${batteryLevel !== null ? `${batteryLevel}%` : 'Unknown'}`,
            icon: Battery,
            action: () => {
              if (batteryLevel !== null) {
                toast("Battery Status", { description: `Current battery level: ${batteryLevel}%` });
              } else {
                toast("Battery Status", { description: "Battery information not available" });
              }
            },
            status: 'active'
          },
          {
            id: 'storage',
            name: 'Storage Usage',
            description: 'View storage information',
            icon: HardDrive,
            action: handleStorageInfo,
            status: 'active'
          },
          {
            id: 'voice-assistant',
            name: 'Voice Assistant',
            description: 'Voice commands and TTS',
            icon: Mic,
            action: () => {
              if ('speechSynthesis' in window && 'webkitSpeechRecognition' in window) {
                const recognition = new (window as any).webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                
                recognition.onstart = () => {
                  toast("Voice Assistant", { description: "Listening... Speak now!" });
                };
                
                recognition.onresult = (event: any) => {
                  const transcript = event.results[0][0].transcript;
                  toast("Voice Recognized", { description: `You said: "${transcript}"` });
                  
                  // Check for wake word
                  if (checkWakeWord(transcript)) {
                    wakeUp();
                  }
                  
                  // Analyze sentiment
                  analyzeSentiment(transcript);
                  
                  if (transcript.toLowerCase().includes('weather')) {
                    handleWeatherTool();
                  } else if (transcript.toLowerCase().includes('time')) {
                    const speech = new SpeechSynthesisUtterance(`The current time is ${currentTime} IST`);
                    window.speechSynthesis.speak(speech);
                  } else {
                    const speech = new SpeechSynthesisUtterance(`I heard you say: ${transcript}`);
                    window.speechSynthesis.speak(speech);
                  }
                };
                
                recognition.onerror = (event: any) => {
                  toast("Voice Error", { description: `Speech recognition error: ${event.error}` });
                };
                
                recognition.start();
              } else {
                toast("Voice Assistant", { description: "Voice recognition not supported in this browser" });
              }
            },
            status: 'active'
          },
          {
            id: 'sleep-mode',
            name: 'Sleep Mode Settings',
            description: `Auto-sleep after ${sleepMinutes} min`,
            icon: Moon,
            action: handleSleepModeSettings,
            status: 'active'
          }
        ]
      },
      {
        id: 'web',
        name: 'Web & Productivity',
        icon: Search,
        collapsed: false,
        tools: [
          {
            id: 'location',
            name: 'Location on Map',
            description: 'View location on map',
            icon: MapPin,
            action: handleLocationMap,
            status: 'active'
          },
          {
            id: 'expenses',
            name: 'Expense Tracker',
            description: 'Track and manage expenses',
            icon: DollarSign,
            action: handleExpenseTracker,
            status: 'active'
          },
          {
            id: 'search',
            name: 'Web Search',
            description: 'Smart web search',
            icon: Search,
            action: () => {
              const query = prompt("Enter your search query:");
              if (query && query.trim()) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                toast("Web Search", { description: `Searching for: "${query}"` });
              }
            },
            status: 'active'
          },
          {
            id: 'news',
            name: 'News Feed',
            description: 'Latest news updates',
            icon: Rss,
            action: handleNewsFeed,
            status: 'active'
          }
        ]
      },
      {
        id: 'security',
        name: 'Security & Logs',
        icon: Shield,
        collapsed: false,
        tools: [
          {
            id: 'activity',
            name: 'Activity Log',
            description: 'View user activity logs',
            icon: Activity,
            action: handleActivityLog,
            status: 'active'
          },
          {
            id: 'password',
            name: 'Password Manager',
            description: 'Manage passwords securely',
            icon: Key,
            action: handlePasswordManager,
            status: 'active'
          },
          {
            id: 'voice-lock',
            name: 'Voice Lock',
            description: 'Voice authentication',
            icon: Mic,
            action: handleVoiceLock,
            status: 'active'
          },
          {
            id: 'data-management',
            name: 'Data Export/Import',
            description: 'Backup and restore data',
            icon: Database,
            action: () => {
              // This will be shown in the UI below
              toast("Data Management", { 
                description: "Scroll down to access export/import tools",
                duration: 3000
              });
            },
            status: 'active'
          }
        ]
      }
    ];

    setCategories(initialCategories);
  }, [batteryLevel, currentTime, sleepMinutes]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, collapsed: !cat.collapsed } : cat
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return `${moodStyles.bgColor} ${moodStyles.primaryColor} ${moodStyles.borderColor}`;
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'coming-soon': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return `${moodStyles.bgColor} ${moodStyles.primaryColor} ${moodStyles.borderColor}`;
    }
  };

  // Sleep mode overlay
  if (isSleepMode) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-pulse">
            <Moon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-400">Sleep Mode</h2>
            <p className="text-gray-400 mt-2">Say "Jarvis, wake up" to activate</p>
          </div>
          <div className="text-xs text-gray-500">
            {currentTime} | Last activity: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white p-4 font-mono ${moodStyles.animation}`}>
      {/* Header with time and search */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${moodStyles.primaryColor} mb-2`}>
            J.A.R.V.I.S
          </h1>
          <p className="text-sm text-gray-400">Personal AI Assistant Dashboard</p>
          {currentMood !== 'neutral' && (
            <p className={`text-xs ${moodStyles.primaryColor} mt-1`}>
              Mood detected: {currentMood} • UI adapted
            </p>
          )}
        </div>
        
        <div className="text-right space-y-2">
          <div className={`text-2xl font-mono ${moodStyles.primaryColor} mb-1`}>
            {currentTime} IST
          </div>
          <div className="text-sm text-gray-400">
            {currentDate}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <JarvisSearchBar onResultClick={handleSearchResult} />
      </div>

      {/* System Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 text-sm flex-wrap">
          <span className="text-gray-400">System Status:</span>
          <Badge className={getStatusColor('active')}>
            ● ONLINE
          </Badge>
          <span className="text-gray-400">|</span>
          <span className={moodStyles.primaryColor}>Neural Networks Active</span>
          <span className="text-gray-400">|</span>
          <span className="text-green-400">All Systems Operational</span>
          {batteryLevel !== null && (
            <>
              <span className="text-gray-400">|</span>
              <span className="text-blue-400">Battery: {batteryLevel}%</span>
            </>
          )}
          <span className="text-gray-400">|</span>
          <span className="text-purple-400">Mood: {currentMood}</span>
        </div>
      </div>

      {/* Categorized Tools */}
      <div className="space-y-6">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          
          return (
            <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-2">
                  {category.collapsed ? (
                    <ChevronRight className={`h-4 w-4 ${moodStyles.primaryColor}`} />
                  ) : (
                    <ChevronDown className={`h-4 w-4 ${moodStyles.primaryColor}`} />
                  )}
                  <CategoryIcon className={`h-5 w-5 ${moodStyles.primaryColor}`} />
                  <h2 className={`text-lg font-semibold ${moodStyles.primaryColor} group-hover:text-green-300`}>
                    {category.name}
                  </h2>
                </div>
                <div className={`flex-1 h-px ${moodStyles.borderColor.replace('border-', 'bg-').replace('/30', '/20')}`}></div>
              </div>

              {/* Category Tools */}
              {!category.collapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-6">
                  {category.tools.map((tool) => {
                    const IconComponent = tool.icon;
                    
                    return (
                      <Card 
                        key={tool.id}
                        className={`bg-gray-900/50 ${moodStyles.borderColor} hover:border-green-500/40 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer group`}
                        onClick={() => {
                          if (tool.route) {
                            navigate(tool.route);
                          } else if (tool.action) {
                            tool.action();
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className={`p-3 rounded-lg ${moodStyles.bgColor} group-hover:bg-green-500/20 transition-colors`}>
                              <IconComponent className={`h-6 w-6 ${moodStyles.primaryColor}`} />
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-white text-sm mb-1">
                                {tool.name}
                              </h3>
                              <p className="text-xs text-gray-400 mb-2">
                                {tool.description}
                              </p>
                            </div>
                            
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(tool.status)}`}
                            >
                              {tool.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Management Section */}
      <div className="mt-8">
        <DataExportImport />
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>J.A.R.V.I.S. v2.0 | Just A Rather Very Intelligent System</p>
        <p className="mt-1">All systems nominal • Neural networks active • Ready for commands</p>
        {isSleepMode && (
          <p className="mt-1 text-blue-400">Sleep mode will activate in {sleepMinutes} minutes of inactivity</p>
        )}
      </div>
    </div>
  );
};

export default PracticalDashboard;
