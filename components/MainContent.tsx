
import React, { useEffect } from 'react';
import { SIDEBAR_ITEMS } from '../constants';
import HomeDashboard from './HomeDashboard';
import CommercialView from './CommercialView';
import ComplianceView from './ComplianceView';
import LogisticsView from './LogisticsView';
import ProcurementView from './ProcurementView';
import FinanceView from './FinanceView';
import AIAssistantView from './AIAssistantView';
import SystemSettingsView from './SystemSettingsView';
import DocumentHubView from './DocumentHubView';
import type { Breadcrumb, CompanySettings, StatusBarSettings } from '../types';
import type { Theme } from '../App';

interface MainContentProps {
  activeView: string;
  activeSubView: string | null;
  setActiveView: (view: string) => void;
  setActiveSubView: (view: string | null) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  companySettings: CompanySettings;
  setCompanySettings: (settings: CompanySettings) => void;
  statusBarSettings: StatusBarSettings;
  setStatusBarSettings: (settings: StatusBarSettings) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
    activeView, 
    activeSubView, 
    setActiveView, 
    setActiveSubView, 
    setBreadcrumbs, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    theme, 
    setTheme,
    companySettings,
    setCompanySettings,
    statusBarSettings,
    setStatusBarSettings
}) => {

  useEffect(() => {
    const mainItem = SIDEBAR_ITEMS.find(item => item.id === activeView);
    if (!mainItem) {
        setBreadcrumbs([{ label: "Dashboard" }]);
        return;
    };
    
    // Let module-specific views handle their own complex breadcrumbs
    const viewsWithCustomCrumbs = ['commercial', 'compliance', 'logistics', 'procurement', 'finance'];
    if (viewsWithCustomCrumbs.includes(activeView)) {
        return;
    }

    const crumbs: Breadcrumb[] = [{ label: mainItem.label }];
    setBreadcrumbs(crumbs);

  }, [activeView, activeSubView, setBreadcrumbs, setActiveView, setActiveSubView]);


  const renderContent = () => {
    switch(activeView) {
        case 'home':
            return <HomeDashboard />;
        case 'commercial':
            return <CommercialView 
                        activeSubView={activeSubView} 
                        setActiveSubView={setActiveSubView} 
                        setBreadcrumbs={setBreadcrumbs}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />;
        case 'compliance':
            return <ComplianceView 
                        activeSubView={activeSubView} 
                        setActiveSubView={setActiveSubView}
                        setBreadcrumbs={setBreadcrumbs}
                    />;
        case 'logistics':
            return <LogisticsView 
                        activeSubView={activeSubView}
                        setActiveView={setActiveView}
                        setActiveSubView={setActiveSubView}
                        setBreadcrumbs={setBreadcrumbs}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />;
        case 'procurement':
            return <ProcurementView 
                        activeSubView={activeSubView} 
                        setActiveSubView={setActiveSubView}
                        setBreadcrumbs={setBreadcrumbs}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />;
        case 'finance':
            return <FinanceView 
                        activeSubView={activeSubView} 
                        setActiveSubView={setActiveSubView}
                        setBreadcrumbs={setBreadcrumbs}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />;
        case 'document-hub':
            return <DocumentHubView />;
        case 'system-intelligence':
            return <AIAssistantView />;
        case 'system-settings':
            return <SystemSettingsView 
                        theme={theme} 
                        setTheme={setTheme}
                        companySettings={companySettings}
                        setCompanySettings={setCompanySettings}
                        statusBarSettings={statusBarSettings}
                        setStatusBarSettings={setStatusBarSettings}
                    />;
        default:
            return <HomeDashboard />;
    }
  }

  return <div className="h-full">{renderContent()}</div>;
};

export default MainContent;