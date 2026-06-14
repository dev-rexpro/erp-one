import React, { useState } from 'react';
import { SIDEBAR_ITEMS, ChevronDownIcon } from '../constants';
import type { SidebarNavItem } from '../types';
import { ScrollArea } from './ui/scroll-area';

interface SidebarProps {
  isSidebarOpen: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  activeSubView: string | null;
  setActiveSubView: (view: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, activeView, setActiveView, activeSubView, setActiveSubView }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleNavClick = (item: SidebarNavItem) => {
    // Check if the item is expandable (i.e., has a subItems array)
    if (item.subItems !== undefined) {
      // Always toggle the section's open/closed state
      toggleSection(item.id);

      // If the section isn't the currently active one, switch the view to it.
      if (activeView !== item.id) {
        setActiveView(item.id);
        // Default to dashboard if there are sub-items, otherwise it's just a top-level page
        setActiveSubView(item.subItems.length > 0 ? 'dashboard' : null);
      }
    } else {
      // This is for simple links without sub-menus
      setActiveView(item.id);
      setActiveSubView(null);
    }
  };

  const handleSubItemClick = (parentItem: SidebarNavItem, subItem: SidebarNavItem) => {
    setActiveView(parentItem.id);
    setActiveSubView(subItem.id);
  };
  
  const renderNavItem = (item: SidebarNavItem) => {
    const isMainActive = activeView === item.id;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openSections.has(item.id);

    return (
      <li key={item.id}>
        <a
          href={item.href || '#'}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(item);
          }}
          className={`flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 ${
            isMainActive && !hasSubItems ? 'bg-gray-200 dark:bg-gray-700' : ''
          } ${
            isMainActive && hasSubItems ? 'font-semibold text-gray-900 dark:text-gray-100' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {item.subItems !== undefined && ( // Show dropdown for any item with subItems array
            <ChevronDownIcon className={`h-5 w-5 text-gray-800 transform transition-transform duration-200 dark:text-gray-300 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </a>
        {isOpen && hasSubItems && (
           <ul className="pl-4 pt-1">
            {item.subItems?.map(subItem => {
                const isSubActive = isMainActive && activeSubView === subItem.id;
                return (
                    <li key={subItem.id}>
                        <a
                         href="#"
                         onClick={(e) => {
                            e.preventDefault();
                            handleSubItemClick(item, subItem);
                         }}
                         className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 ${
                            isSubActive ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-400'
                         }`}
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </a>
                    </li>
                )
            })}
           </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={`flex w-64 flex-col bg-white dark:bg-gray-800 ${!isSidebarOpen && 'hidden'}`}>
      <ScrollArea className="flex-1 min-h-0">
        <ul className="space-y-1 p-2">
          {SIDEBAR_ITEMS.map(renderNavItem)}
        </ul>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;