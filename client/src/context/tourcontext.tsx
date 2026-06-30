import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  route: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '#tour-welcome',
    title: 'Welcome to Media Scheduler! 👋',
    content: "Let's take a quick 1-minute tour to show you around and get you started.",
    placement: 'bottom',
    route: '/dashboard'
  },
  {
    target: '#tour-stats',
    title: 'Performance Stats 📊',
    content: 'See your scheduled posts, published posts, and connected accounts at a glance.',
    placement: 'bottom',
    route: '/dashboard'
  },
  {
    target: '#tour-analytics',
    title: 'Post Performance Analytics 📈',
    content: 'Track your engagement trends (Likes, Comments, Shares) over the last 7 days.',
    placement: 'top',
    route: '/dashboard'
  },
  {
    target: '#tour-nav-accounts',
    title: 'Link Social Accounts 🔗',
    content: "First, you need to connect your social profiles. Let's go to the Accounts page.",
    placement: 'right',
    route: '/dashboard'
  },
  {
    target: '#tour-platform-cards',
    title: 'Connect Platforms 🔌',
    content: 'You can connect Facebook, Instagram, LinkedIn, or Twitter/X here with one click.',
    placement: 'bottom',
    route: '/accounts'
  },
  {
    target: '#tour-nav-composer',
    title: 'AI Content Composer 🤖',
    content: "Now, let's see how to write posts with AI. Let's go to the AI Composer page.",
    placement: 'right',
    route: '/accounts'
  },
  {
    target: '#tour-composer-input',
    title: 'Generate with AI ✨',
    content: 'Type your idea, select a tone, and click Generate. The AI will write the post and generate a matching image!',
    placement: 'bottom',
    route: '/ai-composer'
  },
  {
    target: '#tour-nav-scheduler',
    title: 'Schedule Posts 📅',
    content: "Finally, let's look at the Scheduler. Let's go to the Scheduler page.",
    placement: 'right',
    route: '/ai-composer'
  },
  {
    target: '#tour-scheduler-calendar',
    title: 'Visual Content Calendar 🗓️',
    content: 'View, edit, and plan all your upcoming posts in a beautiful weekly/monthly grid. You are all set!',
    placement: 'top',
    route: '/scheduler'
  }
];

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check if tour should start (triggered by registration)
  useEffect(() => {
    const showTour = localStorage.getItem('showTour');
    if (showTour === 'true') {
      setIsActive(true);
      setCurrentStepIndex(0);
      localStorage.removeItem('showTour'); // Only trigger once
    }
  }, []);

  // Handle route changes for steps
  useEffect(() => {
    if (!isActive) return;
    const currentStep = TOUR_STEPS[currentStepIndex];
    if (currentStep && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [currentStepIndex, isActive, navigate]);

  // Find and track target element position
  useEffect(() => {
    if (!isActive) return;
    const currentStep = TOUR_STEPS[currentStepIndex];
    if (!currentStep) return;

    const updateRect = () => {
      const el = document.querySelector(currentStep.target);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    
    // Poll to handle dynamic content loading
    const interval = setInterval(updateRect, 200);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [currentStepIndex, location.pathname, isActive]);

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
    navigate('/dashboard');
  };

  const endTour = () => {
    setIsActive(false);
    setTargetRect(null);
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <TourContext.Provider value={{ isActive, currentStepIndex, startTour, endTour, nextStep, prevStep }}>
      {children}
      
      {/* Tour Overlay Portal */}
      {isActive && currentStep && targetRect && (
        <div className="fixed inset-0 z-[9999] pointer-events-none font-sans">
          {/* Dark Overlay with Spotlight Cutout */}
          <div 
            className="absolute inset-0 bg-slate-900/50 transition-all duration-300 pointer-events-auto"
            style={{
              clipPath: `polygon(
                0% 0%, 
                0% 100%, 
                ${targetRect.left - 8}px 100%, 
                ${targetRect.left - 8}px ${targetRect.top - 8}px, 
                ${targetRect.right + 8}px ${targetRect.top - 8}px, 
                ${targetRect.right + 8}px ${targetRect.bottom + 8}px, 
                ${targetRect.left - 8}px ${targetRect.bottom + 8}px, 
                ${targetRect.left - 8}px 100%, 
                100% 100%, 
                100% 0%
              )`
            }}
            onClick={endTour}
          />

          {/* Spotlight Pulsing Border */}
          <div 
            className="absolute border-2 border-red-500 rounded-xl pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            style={{
              left: targetRect.left - 8,
              top: targetRect.top - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />

          {/* Interactive Tooltip Box */}
          <div 
            className="absolute bg-white text-slate-800 p-5 rounded-2xl shadow-2xl border border-slate-150 pointer-events-auto transition-all duration-300 w-80 flex flex-col gap-3"
            style={{
              left: currentStep.placement === 'right' 
                ? targetRect.right + 20 
                : currentStep.placement === 'left'
                ? targetRect.left - 340
                : targetRect.left + (targetRect.width / 2) - 160,
              top: currentStep.placement === 'bottom'
                ? targetRect.bottom + 20
                : currentStep.placement === 'top'
                ? targetRect.top - 180
                : targetRect.top + (targetRect.height / 2) - 90,
            }}
          >
            {/* Tooltip Content */}
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-850">{currentStep.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{currentStep.content}</p>
            </div>

            {/* Footer / Controls */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400">
                {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={endTour}
                  className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Skip
                </button>
                {currentStepIndex > 0 && (
                  <button 
                    onClick={prevStep}
                    className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  className="px-3 py-1 text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
