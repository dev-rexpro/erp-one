import React, { useState, useEffect } from 'react';
import { Wifi, Database, CheckCircle2, Clock, UserCircle, GitBranch } from 'lucide-react';
import type { StatusBarSettings } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface StatusBarProps {
    settings: StatusBarSettings;
    userEmail: string | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ settings, userEmail }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [exchangeRate, setExchangeRate] = useState(16450.50);
  const [trend, setTrend] = useState<'up' | 'down' | 'flat'>('flat');

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial exchange rate and run real-time updates
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // 1. Fetch initial rate from API
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.IDR) {
          const rate = parseFloat(data.rates.IDR.toFixed(2));
          setExchangeRate(rate);
        }
      })
      .catch(err => {
        console.warn("Could not fetch exchange rate, using fallback.", err);
      });

    // 2. Simulated live market fluctuations (every 7 seconds)
    const interval = setInterval(() => {
      setExchangeRate(prev => {
        const tick = (Math.random() - 0.5) * 4; // Fluctuate by +/- 2 IDR
        const nextRate = parseFloat((prev + tick).toFixed(2));
        
        setTrend(nextRate > prev ? 'up' : nextRate < prev ? 'down' : 'flat');
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Reset trend indicator to flat after 1.5 seconds (temporary flash effect)
        timeoutId = setTimeout(() => {
          setTrend('flat');
        }, 1500);

        return nextRate;
      });
    }, 7000);

    return () => {
      clearInterval(interval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const formatDateAndTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <footer className="flex h-8 flex-shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50 px-6 dark:bg-gray-800 dark:border-gray-700">
      {/* Left side: Status indicators */}
      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
        {settings.showSystemStatus && (
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span>System: Online</span>
            </div>
        )}
        {settings.showDatabaseStatus && (
            <div className="flex items-center space-x-1.5">
              <Database className={`h-3 w-3 ${isSupabaseConfigured ? 'text-green-500' : 'text-amber-500'}`} />
              <span>Database: {isSupabaseConfigured ? 'Supabase (OK)' : 'Local Storage'}</span>
            </div>
        )}
        {settings.showSyncStatus && (
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className={`h-3 w-3 ${isSupabaseConfigured ? 'text-green-500' : 'text-amber-500'}`} />
              <span>Sync: {isSupabaseConfigured ? 'OK (Cloud)' : 'Local Cache'}</span>
            </div>
        )}
        {settings.showVersion && (
            <div className="flex items-center space-x-1.5">
                <GitBranch className="h-3 w-3" />
                <span>v1.0.0</span>
            </div>
        )}
      </div>

      {/* Right side: User, Exchange Rate, and Time */}
      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
        {settings.showCurrentUser && (
            <div className="flex items-center space-x-1.5">
              <UserCircle className="h-3 w-3" />
              <span>{userEmail || 'sandbox@rexcorp.id'}</span>
            </div>
        )}
        {settings.showCurrentUser && (settings.showExchangeRate || settings.showDateTime) && (
            <span className="text-gray-300 dark:text-gray-600 select-none">|</span>
        )}
        {settings.showExchangeRate && (
            <div className="flex items-center space-x-1 tabular-nums">
                <span className="text-gray-500 dark:text-gray-400">USD/IDR:</span>
                <span className={`font-semibold transition-colors duration-300 flex items-center ${
                  trend === 'up' ? 'text-green-600 dark:text-green-400' :
                  trend === 'down' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-800 dark:text-gray-200'
                }`}>
                  {exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className={`ml-0.5 text-[10px] select-none transition-all duration-300 ${
                    trend === 'up' ? 'text-green-500 opacity-100' :
                    trend === 'down' ? 'text-red-500 opacity-100' :
                    'opacity-0'
                  }`}>
                    {trend === 'down' ? '▼' : '▲'}
                  </span>
                </span>
            </div>
        )}
        {settings.showExchangeRate && settings.showDateTime && (
            <span className="text-gray-300 dark:text-gray-600 select-none">|</span>
        )}
        {settings.showDateTime && (
            <div className="flex items-center space-x-1.5 tabular-nums">
              <Clock className="h-3 w-3" />
              <span>{formatDateAndTime(currentDateTime)}</span>
            </div>
        )}
      </div>
    </footer>
  );
};

export default StatusBar;