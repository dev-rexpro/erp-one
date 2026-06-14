

import React, { useState } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronRightIcon, PanelLeftIcon, PanelRightIcon } from '../constants';
import type { Breadcrumb, CompanySettings } from '../types';
import { LogOut, User, Settings, HelpCircle, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
  breadcrumbs: Breadcrumb[];
  isSidebarOpen: boolean;
  companySettings: CompanySettings;
  userEmail: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  breadcrumbs, 
  isSidebarOpen, 
  companySettings,
  userEmail,
  onLogout
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();

  const getUserInitials = (email: string | null) => {
    if (!email) return 'US';
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between bg-white pr-6 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center h-full">
        {/* Toggle + Logo container, always 256px wide to match the sidebar */}
        <div 
          className="flex items-center pl-6 h-full" 
          style={{ width: '256px', gap: '16px' }}
        >
          <button
            onClick={toggleSidebar}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition-all dark:hover:bg-gray-700"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isHovered ? (
              isSidebarOpen ? (
                <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <ChevronDoubleRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )
            ) : isSidebarOpen ? (
              <PanelLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <PanelRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          {companySettings.logo ? (
              <img src={companySettings.logo} alt={`${companySettings.name} Logo`} className="h-8 w-auto" />
          ) : (
              <div className="flex h-8 items-center justify-center rounded-md bg-black px-3 text-sm font-bold text-white">
                  {getInitials(companySettings.name) || 'REX'}
              </div>
          )}
        </div>
        
        <nav className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRightIcon className="h-4 w-4" />}
                {crumb.onClick && !isLast ? (
                  <button onClick={crumb.onClick} className="hover:text-gray-800 hover:underline dark:hover:text-gray-200">
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-800 font-semibold dark:text-gray-100">{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search or type a command (Ctrl + G)"
            className="w-80 rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-gray-500"
          />
        </div>
        <button className="rounded-lg p-1.5 hover:bg-gray-100 transition-all dark:hover:bg-gray-700">
          <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center space-x-2">
           <button className="rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-all dark:hover:bg-gray-700 flex items-center space-x-1">
             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Help</span>
             <ChevronDownIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
           </button>
        </div>

        {/* Dynamic User Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground cursor-pointer focus:outline-none hover:opacity-90 transition-opacity">
              {getUserInitials(userEmail)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg">
            <DropdownMenuLabel className="font-mono text-xs text-gray-500 dark:text-gray-400">
              Active Session
            </DropdownMenuLabel>
            <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-white truncate">
              {userEmail || 'sandbox@rexcorp.id'}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>User Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Access Control</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onLogout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;