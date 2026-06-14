
import React, { useState, useRef, useEffect } from 'react';
import type { Theme } from '../App';
import type { CompanySettings, StatusBarSettings } from '../types';
import { Sun, Moon, Monitor, UploadCloud } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface SystemSettingsViewProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    companySettings: CompanySettings;
    setCompanySettings: (settings: CompanySettings) => void;
    statusBarSettings: StatusBarSettings;
    setStatusBarSettings: (settings: StatusBarSettings) => void;
}

const ThemeOption: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-24 h-16 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isActive
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
    >
        {icon}
        <span className="mt-1 text-xs">{label}</span>
    </button>
);


const CompanyProfileSettings: React.FC<{
    settings: CompanySettings;
    onSettingsChange: (newSettings: CompanySettings) => void;
}> = ({ settings, onSettingsChange }) => {
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        onSettingsChange({ ...settings, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onSettingsChange({ ...settings, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Company Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo Section */}
                <div className="md:col-span-1">
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Company Logo</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload your company logo. Recommended size: 200x50px.</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                            {settings.logo ? (
                                <img src={settings.logo} alt="Company Logo" className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">Preview</span>
                            )}
                        </div>
                        <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                        <button 
                            onClick={() => logoInputRef.current?.click()}
                            className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            <UploadCloud className="h-4 w-4" />
                            <span>Change</span>
                        </button>
                    </div>
                </div>

                {/* Details Form */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                        <input type="text" name="name" id="name" value={settings.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Administrator Email</label>
                        <input type="email" name="adminEmail" id="adminEmail" value={settings.adminEmail} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Address</label>
                        <textarea name="address" id="address" value={settings.address} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Financial Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                 <div>
                    <label htmlFor="fiscalYearStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fiscal Year Start</label>
                    <input type="date" name="fiscalYearStart" id="fiscalYearStart" value={settings.fiscalYearStart} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                    <div>
                    <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
                    <Select value={settings.defaultCurrency} onValueChange={val => onSettingsChange({ ...settings, defaultCurrency: val })}>
                        <SelectTrigger className="mt-1 w-full py-2 pl-3 pr-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                     <Select value={settings.timezone} onValueChange={val => onSettingsChange({ ...settings, timezone: val })}>
                        <SelectTrigger className="mt-1 w-full py-2 pl-3 pr-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                            <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                            <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

const ToggleSwitch: React.FC<{
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
    <div className="flex items-start justify-between">
        <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{label}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button
            type="button"
            className={`${enabled ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);


const StatusBarSettingsComponent: React.FC<{
    settings: StatusBarSettings;
    onSettingsChange: (newSettings: StatusBarSettings) => void;
}> = ({ settings, onSettingsChange }) => {

    const handleToggle = (key: keyof StatusBarSettings, value: boolean) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Status Bar</h2>
             <div className="space-y-6">
                <ToggleSwitch 
                    label="System & Database Status" 
                    description="Show indicators for system, database, and sync health."
                    enabled={settings.showSystemStatus}
                    onChange={(value) => {
                        onSettingsChange({
                           ...settings,
                           showSystemStatus: value,
                           showDatabaseStatus: value,
                           showSyncStatus: value
                        });
                    }}
                />
                 <ToggleSwitch 
                    label="Currency Exchange Rate" 
                    description="Display the latest USD/IDR exchange rate."
                    enabled={settings.showExchangeRate}
                    onChange={(value) => handleToggle('showExchangeRate', value)}
                />
                 <ToggleSwitch 
                    label="Date & Time" 
                    description="Show the current local date and time."
                    enabled={settings.showDateTime}
                    onChange={(value) => handleToggle('showDateTime', value)}
                />
                 <ToggleSwitch 
                    label="Current User" 
                    description="Display the currently logged-in user's initials."
                    enabled={settings.showCurrentUser}
                    onChange={(value) => handleToggle('showCurrentUser', value)}
                />
                 <ToggleSwitch 
                    label="Application Version" 
                    description="Show the current ERP version number."
                    enabled={settings.showVersion}
                    onChange={(value) => handleToggle('showVersion', value)}
                />
            </div>
        </div>
    )
};


const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({ theme, setTheme, companySettings, setCompanySettings, statusBarSettings, setStatusBarSettings }) => {
    const [activeTab, setActiveTab] = useState('application');
    
    // Local state for editing
    const [localCompanySettings, setLocalCompanySettings] = useState<CompanySettings>(companySettings);
    const [localStatusBarSettings, setLocalStatusBarSettings] = useState<StatusBarSettings>(statusBarSettings);
    const [showSuccess, setShowSuccess] = useState(false);

    const tabs = [
        { id: 'application', label: 'Application' },
        { id: 'account', label: 'Account' },
        { id: 'integration', label: 'Integrations' },
        { id: 'tax-banking', label: 'Tax & Banking' },
    ];
    
    useEffect(() => {
        setLocalCompanySettings(companySettings);
    }, [companySettings]);
    
    useEffect(() => {
        setLocalStatusBarSettings(statusBarSettings);
    }, [statusBarSettings]);

    const handleSaveChanges = () => {
        setCompanySettings(localCompanySettings);
        setStatusBarSettings(localStatusBarSettings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">System Settings</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your workspace settings, integrations, and preferences.</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-gray-900 text-gray-900 dark:text-gray-100'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                {activeTab === 'application' && (
                    <div className="space-y-12">
                         {/* Theme Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Application Appearance</h2>
                            <div className="space-y-2">
                                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Theme</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select how you want REXCorp ERP to appear.</p>
                            </div>
                            
                            <div className="flex space-x-3">
                                <ThemeOption
                                    label="Light"
                                    icon={<Sun className="w-5 h-5" />}
                                    isActive={theme === 'light'}
                                    onClick={() => setTheme('light')}
                                />
                                <ThemeOption
                                    label="Dark"
                                    icon={<Moon className="w-5 h-5" />}
                                    isActive={theme === 'dark'}
                                    onClick={() => setTheme('dark')}
                                />
                                <ThemeOption
                                    label="System"
                                    icon={<Monitor className="w-5 h-5" />}
                                    isActive={theme === 'system'}
                                    onClick={() => setTheme('system')}
                                />
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-700" />

                        {/* Company Profile Section */}
                        <CompanyProfileSettings 
                            settings={localCompanySettings} 
                            onSettingsChange={setLocalCompanySettings}
                        />

                         <hr className="border-gray-200 dark:border-gray-700" />
                        
                        {/* Status Bar Settings Section */}
                        <StatusBarSettingsComponent
                            settings={localStatusBarSettings}
                            onSettingsChange={setLocalStatusBarSettings}
                        />

                        {/* Save Button */}
                        <div className="flex justify-end items-center pt-4">
                             {showSuccess && <p className="text-sm text-green-600 dark:text-green-400 mr-4">Settings saved successfully!</p>}
                            <button 
                                onClick={handleSaveChanges}
                                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
                
                {activeTab !== 'application' && (
                     <div className="text-center py-12">
                         <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Coming Soon</h3>
                         <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Settings for this section are under development.</p>
                     </div>
                )}
            </div>
        </div>
    );
};

export default SystemSettingsView;