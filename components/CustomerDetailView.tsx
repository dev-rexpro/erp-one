import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
    ArrowLeftIcon, 
    ArrowRightIcon, 
    PrinterIcon, 
    DotsHorizontalIcon,
    ChevronDownIcon,
    PlusIcon,
    HeartIcon,
    CommentIcon,
    CUSTOMER_ACTIVITY_LOG,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    AlignLeftIcon,
    AlignRightIcon,
} from '../constants';

interface CustomerDetailViewProps {
    customer: Customer;
    onBack: () => void;
    onSaveCustomer: (customer: Customer) => void;
    isSubPanelOpen: boolean;
    toggleSubPanel: () => void;
}

const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ 
    customer, 
    onBack, 
    onSaveCustomer, 
    isSubPanelOpen, 
    toggleSubPanel 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useState("Details");
    
    const tabs = ["Details", "Address & Contact", "Tax", "Accounting", "Sales Team", "Settings", "Portal Users"];

    // Editable form state initialized from active customer details
    const [name, setName] = useState(customer.name);
    const [status, setStatus] = useState<'Enabled' | 'Disabled'>(customer.status);
    const [group, setGroup] = useState(customer.group);
    const [territory, setTerritory] = useState(customer.territory);

    // Context details from cache
    const [email, setEmail] = useState(() => {
        const cached = JSON.parse(localStorage.getItem('CUSTOMER_EMAILS') || '{}');
        return cached[customer.id] || '';
    });
    const [phone, setPhone] = useState(() => {
        const cached = JSON.parse(localStorage.getItem('CUSTOMER_PHONES') || '{}');
        return cached[customer.id] || '';
    });
    const [address, setAddress] = useState(() => {
        const cached = JSON.parse(localStorage.getItem('CUSTOMER_ADDRESSES') || '{}');
        return cached[customer.id] || '';
    });

    const getInitials = (n: string) => {
        return n.split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase();
    }

    const activityIcon = (type: Activity['type']) => {
        if (type === 'comment') {
            return <CommentIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
        }
        return <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>;
    }

    const handleSave = () => {
        if (!name.trim()) return;

        const updatedCustomer: Customer = {
            ...customer,
            name: name.trim(),
            status,
            group,
            territory: territory.trim(),
            initials: getInitials(name.trim())
        };

        const existingEmails = JSON.parse(localStorage.getItem('CUSTOMER_EMAILS') || '{}');
        const existingPhones = JSON.parse(localStorage.getItem('CUSTOMER_PHONES') || '{}');
        const existingAddresses = JSON.parse(localStorage.getItem('CUSTOMER_ADDRESSES') || '{}');

        existingEmails[customer.id] = email.trim();
        existingPhones[customer.id] = phone.trim();
        existingAddresses[customer.id] = address.trim();

        localStorage.setItem('CUSTOMER_EMAILS', JSON.stringify(existingEmails));
        localStorage.setItem('CUSTOMER_PHONES', JSON.stringify(existingPhones));
        localStorage.setItem('CUSTOMER_ADDRESSES', JSON.stringify(existingAddresses));

        onSaveCustomer(updatedCustomer);
        onBack();
    };
    
    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                     <button
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      onClick={onBack}
                      aria-label="Back to customer list"
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                     <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {customer.name}
                        <span className={`ml-3 rounded-full px-2.5 py-0.5 text-sm font-medium ${
                            status === 'Enabled' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-905 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-905 dark:text-red-300'
                        }`}>{status}</span>
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        <span>Get History</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    <div className="flex items-center space-x-1">
                        <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"><ArrowLeftIcon className="h-4 w-4"/></button>
                        <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"><ArrowRightIcon className="h-4 w-4"/></button>
                    </div>
                     <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"><PrinterIcon className="h-4 w-4"/></button>
                     <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"><DotsHorizontalIcon className="h-4 w-4"/></button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 space-x-6 overflow-hidden p-6">
                {/* Left Sidebar */}
                <aside className={`w-32 flex-shrink-0 space-y-6 ${!isSubPanelOpen ? 'hidden' : 'md:block'}`}>
                    <div className="flex h-32 w-32 items-center justify-center rounded-md border border-gray-200 bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600">
                        <span className="text-4xl font-bold text-indigo-500 dark:text-indigo-400">{getInitials(name)}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm font-medium">
                        <button className="flex w-full items-center justify-between rounded-md p-1.5 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 text-left"><span>Attachments</span> <PlusIcon className="h-4 w-4"/></button>
                        <button className="flex w-full items-center justify-between rounded-md p-1.5 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 text-left"><span>Tags</span> <PlusIcon className="h-4 w-4"/></button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm pt-2">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <HeartIcon className="h-4 w-4"/>
                            <span>{customer.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <CommentIcon className="h-4 w-4"/>
                            <span>{customer.comments}</span>
                        </div>
                    </div>
                </aside>

                {/* Right Content */}
                <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
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
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
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
                                <div className="space-y-4 max-w-xl">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="customer@email.com"
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Phone Number</label>
                                        <input 
                                            type="text" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+62..."
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Billing / Shipping Address</label>
                                        <textarea 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter address details..."
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Customer Name *</label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Customer Group</label>
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
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Status</label>
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
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Account Manager</label>
                                        <input 
                                            type="text" 
                                            value="bd@gmail.com" 
                                            disabled 
                                            className="w-full rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 p-2 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 border-t dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Defaults</h3>
                                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Billing Currency</label>
                                        <input type="text" placeholder="USD" disabled className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Default Price List</label>
                                        <input type="text" placeholder="Standard Selling" disabled className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm dark:bg-gray-700 dark:border-gray-600 text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Comments & Activity */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Comments</h3>
                        <div className="flex items-start space-x-3">
                             <div className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 flex">JD</div>
                             <div className="w-full rounded-md border-gray-300 bg-gray-100 p-3 text-sm text-gray-500 shadow-sm dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400">
                                Type a reply / comment
                             </div>
                        </div>

                        <div className="mt-8 border-t dark:border-gray-700 pt-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Activity</h3>
                            </div>

                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {CUSTOMER_ACTIVITY_LOG.map((activity, activityIdx) => (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                        {activityIdx !== CUSTOMER_ACTIVITY_LOG.length - 1 ? (
                                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                                        ) : null}
                                        <div className="relative flex items-start space-x-3">
                                            <div className="relative">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-700 dark:ring-gray-800">
                                                    {activity.type === 'comment' && activity.avatarInitials ? (
                                                         <div className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 flex">{activity.avatarInitials}</div>
                                                    ) : (
                                                       activityIcon(activity.type)
                                                    )}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1 py-1.5">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{activity.user}</span>{' '}
                                                    {activity.type === 'system' ? '' : 'commented'}
                                                    {' '}{activity.content}{' '}
                                                    <span className="whitespace-nowrap">{activity.timestamp}</span>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailView;
