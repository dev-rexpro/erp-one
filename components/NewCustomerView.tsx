import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
    ChevronDownIcon,
    ArrowLeftIcon
} from '../constants';
import type { Customer } from '../types';
import { Checkbox } from '@/components/ui/checkbox';

interface NewCustomerViewProps {
    onBack: () => void;
    onSave: (customer: Customer) => void;
}

const NewCustomerView: React.FC<NewCustomerViewProps> = ({ onBack, onSave }) => {
    const [activeTab, setActiveTab] = useState("Details");
    const tabs = ["Details", "Address & Contact", "Tax", "Accounting", "Sales Team", "Settings", "Portal Users"];

    // Form states
    const [name, setName] = useState('');
    const [territory, setTerritory] = useState('');
    const [group, setGroup] = useState('Corporate');
    const [status, setStatus] = useState<'Enabled' | 'Disabled'>('Enabled');
    const [industry, setIndustry] = useState('');
    const [website, setWebsite] = useState('');
    const [details, setDetails] = useState('');
    
    // Contact states for "Address & Contact" tab
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!name.trim()) {
            setError('Customer Name is required.');
            return;
        }

        const newCustomer: Customer = {
            id: String(Date.now()),
            name: name.trim(),
            status,
            group,
            territory: territory || '',
            originalId: name.trim(),
            lastUpdated: 'Just now',
            comments: 0,
            likes: 0,
            initials: name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        };

        // Cache the detailed contact info
        const existingEmails = JSON.parse(localStorage.getItem('CUSTOMER_EMAILS') || '{}');
        const existingPhones = JSON.parse(localStorage.getItem('CUSTOMER_PHONES') || '{}');
        const existingAddresses = JSON.parse(localStorage.getItem('CUSTOMER_ADDRESSES') || '{}');

        existingEmails[newCustomer.id] = email.trim();
        existingPhones[newCustomer.id] = phone.trim();
        existingAddresses[newCustomer.id] = address.trim();

        localStorage.setItem('CUSTOMER_EMAILS', JSON.stringify(existingEmails));
        localStorage.setItem('CUSTOMER_PHONES', JSON.stringify(existingPhones));
        localStorage.setItem('CUSTOMER_ADDRESSES', JSON.stringify(existingAddresses));

        onSave(newCustomer);
        onBack();
    };
    
    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800">
                 <div className="flex items-center space-x-3">
                     <button 
                        onClick={onBack}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        aria-label="Back to Customer List"
                     >
                         <ArrowLeftIcon className="h-5 w-5" />
                     </button>
                     <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                        New Customer
                        <span className="ml-3 rounded-md bg-orange-100 px-2 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">Not Saved</span>
                    </h1>
                 </div>
                <button 
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    Save
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6 pt-6 custom-scrollbar">
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}
                 
                 <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`border-b-2 py-3 px-1 text-sm font-medium ${
                                        activeTab === tab 
                                        ? 'border-black text-black dark:border-white dark:text-white' 
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Form Content */}
                    <div className="pt-6">
                        {activeTab === "Address & Contact" ? (
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 border-b pb-2">Primary Contact Info</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Phone Number</label>
                                            <input 
                                                type="text" 
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+62..."
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 border-b pb-2">Primary Address details</h3>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Billing / Shipping address</label>
                                        <textarea 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Street info, City, Country"
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
                                            Customer Name <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (error) setError('');
                                            }}
                                            placeholder="Enter Customer Name"
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Customer Group</label>
                                        <Select value={group} onValueChange={val => setGroup(val)}>
                                            <SelectTrigger className="w-full p-2">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Corporate">Corporate</SelectItem>
                                                <SelectItem value="Commercial">Commercial</SelectItem>
                                                <SelectItem value="Individual">Individual</SelectItem>
                                                <SelectItem value="Government">Government</SelectItem>
                                                <SelectItem value="All">All</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Status</label>
                                        <Select value={status} onValueChange={val => setStatus(val as 'Enabled' | 'Disabled')}>
                                            <SelectTrigger className="w-full p-2">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Enabled">Enabled</SelectItem>
                                                <SelectItem value="Disabled">Disabled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="mt-8 border-t dark:border-gray-700 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Defaults</h3>
                                    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                                         <div>
                                             <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Billing Currency</label>
                                             <input type="text" placeholder="USD" className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" disabled />
                                         </div>
                                         <div>
                                             <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Default Price List</label>
                                             <input type="text" placeholder="Standard Selling" className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" disabled />
                                         </div>
                                    </div>
                                </div>
                                 
                                <div className="mt-8 space-y-4 border-t dark:border-gray-700 pt-6">
                                     <button type="button" className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        Internal Customer <ChevronDownIcon className="h-4 w-4 ml-1"/>
                                     </button>
                                                                            <div className="flex items-center space-x-2 pl-2">
                                                                                <Checkbox id="is-internal" className="h-4 w-4 rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" />
                                                                                <label htmlFor="is-internal" className="text-sm text-gray-700 dark:text-gray-300">Is Internal Customer</label>
                                                                            </div>
                                </div>

                                <div className="mt-4 space-y-4 border-t dark:border-gray-700 pt-6">
                                     <button type="button" className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        More Information <ChevronDownIcon className="h-4 w-4 ml-1"/>
                                     </button>
                                     <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Website</label>
                                            <input 
                                                type="text" 
                                                value={website} 
                                                onChange={(e) => setWebsite(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block text-right">Industry</label>
                                            <input 
                                                type="text" 
                                                value={industry} 
                                                onChange={(e) => setIndustry(e.target.value)}
                                                placeholder="e.g. Technology"
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Customer Details</label>
                                            <textarea 
                                                value={details} 
                                                onChange={(e) => setDetails(e.target.value)}
                                                placeholder="Enter historical background or specialized services needed..."
                                                rows={4}
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                            />
                                        </div>
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCustomerView;
