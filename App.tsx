
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import StatusBar from './components/StatusBar';
import { ScrollArea } from './components/ui/scroll-area';
import type { Breadcrumb, CompanySettings, StatusBarSettings } from './types';

export type Theme = 'light' | 'dark' | 'system';

// Default settings
const defaultCompanySettings: CompanySettings = {
  name: 'REXCorp.',
  address: 'Ciwaru Indah Residence Blok B5\nSukamantri, Tamansari, Kab.Bogor 16610\nJawa Barat, Indonesia',
  adminEmail: 'admin@rexcorp.id',
  logo: null,
  fiscalYearStart: '2024-01-01',
  defaultCurrency: 'IDR',
  timezone: 'Asia/Jakarta',
};

const defaultStatusBarSettings: StatusBarSettings = {
    showSystemStatus: true,
    showDatabaseStatus: true,
    showSyncStatus: true,
    showExchangeRate: true,
    showDateTime: true,
    showCurrentUser: true,
    showVersion: true,
};


const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('home');
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'system';
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    try {
        const savedSettings = localStorage.getItem('companySettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultCompanySettings;
    } catch (error) {
        console.error("Failed to parse company settings from localStorage", error);
        return defaultCompanySettings;
    }
  });

  const [statusBarSettings, setStatusBarSettings] = useState<StatusBarSettings>(() => {
    try {
        const savedSettings = localStorage.getItem('statusBarSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultStatusBarSettings;
    } catch (error) {
        console.error("Failed to parse status bar settings from localStorage", error);
        return defaultStatusBarSettings;
    }
  });


  const handleSetCompanySettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    localStorage.setItem('companySettings', JSON.stringify(newSettings));
  };
  
  const handleSetStatusBarSettings = (newSettings: StatusBarSettings) => {
    setStatusBarSettings(newSettings);
    localStorage.setItem('statusBarSettings', JSON.stringify(newSettings));
  };


  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // Use toggle for cleaner add/remove logic
      root.classList.toggle('dark', isDark);
    };
    
    // Apply the theme when the component mounts or the theme state changes
    applyTheme();
    localStorage.setItem('theme', theme);

    // Listen for changes in the system's color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // This handler will be called when the system theme changes
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup the event listener when the component unmounts or the theme changes
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isFullBleed = 
    (activeView === 'commercial' && activeSubView && activeSubView !== 'dashboard') ||
    (activeView === 'logistics' && activeSubView && activeSubView !== 'dashboard');

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header 
        toggleSidebar={toggleSidebar}
        breadcrumbs={breadcrumbs}
        isSidebarOpen={isSidebarOpen}
        companySettings={companySettings}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          activeView={activeView}
          setActiveView={setActiveView}
          activeSubView={activeSubView}
          setActiveSubView={setActiveSubView}
        />
        <ScrollArea className="flex-1 bg-white dark:bg-gray-800">
          <div className={isFullBleed ? 'pt-0 pl-2 pr-0 pb-0' : 'pt-4 px-6 pb-6'}>
            <MainContent
              activeView={activeView}
              activeSubView={activeSubView}
              setActiveSubView={setActiveSubView}
              setBreadcrumbs={setBreadcrumbs}
              setActiveView={setActiveView}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              theme={theme}
              setTheme={setTheme}
              companySettings={companySettings}
              setCompanySettings={handleSetCompanySettings}
              statusBarSettings={statusBarSettings}
              setStatusBarSettings={handleSetStatusBarSettings}
            />
          </div>
        </ScrollArea>
      </div>
      <StatusBar settings={statusBarSettings} />
    </div>
  );
};

export default App;