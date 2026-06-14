

import React, { useState } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronRightIcon, PanelLeftIcon, PanelRightIcon } from '../constants';
import type { Breadcrumb, CompanySettings } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  breadcrumbs: Breadcrumb[];
  isSidebarOpen: boolean;
  companySettings: CompanySettings;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, breadcrumbs, isSidebarOpen, companySettings }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();

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
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;