import React, { useState, useEffect } from 'react';
import type { CustomerContract, ContractServiceItem, Customer } from '../types';
import { 
    ChevronDownIcon,
    DotsHorizontalIcon,
    XIcon,
    ArrowLeftIcon
} from '../constants';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CustomerContractDetailViewProps {
    contract: CustomerContract | null; // Null for new contract
    onBack: () => void;
    onSave: (updated: CustomerContract) => void;
}

const CustomerContractDetailView: React.FC<CustomerContractDetailViewProps> = ({ contract, onBack, onSave }) => {
    const isNew = !contract;
    const [activeTab, setActiveTab] = useState("Details");
    const tabs = ["Details", "Address & Contact", "Terms"];

    // Dynamic Customer List
    const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const cached = localStorage.getItem('CUSTOMERS_DATA');
        if (cached) {
            setAvailableCustomers(JSON.parse(cached));
        }
    }, []);

    // Form inputs state
    const [customerName, setCustomerName] = useState(contract ? contract.customerName : '');
    const [status, setStatus] = useState<CustomerContract['status']>(contract ? contract.status : 'Draft');
    const [startDate, setStartDate] = useState(contract ? contract.startDate : new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(contract ? contract.endDate : '2026-06-30');
    const [contractTemplate, setContractTemplate] = useState('Standard Service Agreement');
    const [termsText, setTermsText] = useState('This contract encapsulates regular freight forwarding clearance services...');

    const [items, setItems] = useState<ContractServiceItem[]>([]);

    useEffect(() => {
        if (!isNew && contract) {
            setItems([
                { id: 1, serviceName: 'Freight Forwarding - Sea', description: 'Standard 20ft container', quantity: 10, rate: 2500, unit: 'Per Container' },
                { id: 2, serviceName: 'Customs Clearance', description: 'Standard import/export clearance', quantity: 10, rate: 500, unit: 'Per Shipment' },
            ]);
        } else {
            setItems([{ id: 1, serviceName: 'Freight Forwarding - Sea', description: 'Custom contract standard cargo handling', quantity: 1, rate: 1000, unit: 'Per Shipment' }]);
        }
    }, [isNew, contract]);
    
    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), serviceName: 'Custom Logistic Service', description: 'Specialized cargo shipping', quantity: 1, rate: 500, unit: 'Per Shipment' }]);
    };

    const handleItemChange = (id: number, field: keyof Omit<ContractServiceItem, 'id'>, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };
    
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handleSave = () => {
        if (!customerName) {
            alert('Please select or fill Customer Name.');
            return;
        }

        const activeContract: CustomerContract = {
            id: contract ? contract.id : String(Date.now()),
            customerName,
            status,
            startDate,
            endDate,
            totalValue: formatCurrency(totalValue),
            contractId: contract ? contract.contractId : `CTR-${startDate.substring(0, 4)}-${Math.floor(Math.random() * 90) + 10}`,
            comments: contract ? contract.comments : 0,
            likes: contract ? contract.likes : 0
        };

        onSave(activeContract);
        onBack();
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800">
                 <div className="flex items-center space-x-4">
                    <button 
                        onClick={onBack}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        aria-label="Back to customer contract list"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {isNew ? 'New Customer Contract' : contract?.contractId}
                        {isNew && <span className="ml-3 rounded-md bg-orange-100 px-2 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">Not Saved</span>}
                    </h1>
                 </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"><DotsHorizontalIcon className="h-4 w-4"/></button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 shadow-sm"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Main Content Form */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6 space-y-6 custom-scrollbar">
                <div className="max-w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`border-b-2 py-3 px-1 text-sm font-medium ${
                                        activeTab === tab 
                                        ? 'border-gray-900 text-gray-900 dark:text-gray-100' 
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                           {/* Customer Field */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Customer *</label>
                               <Select value={customerName} onValueChange={val => setCustomerName(val)}>
                                   <SelectTrigger className="w-full p-2">
                                       <SelectValue placeholder="-- Choose Customer --" />
                                   </SelectTrigger>
                                   <SelectContent>
                                       {availableCustomers.map(cust => (
                                           <SelectItem key={cust.id} value={cust.name}>{cust.name}</SelectItem>
                                       ))}
                                   </SelectContent>
                               </Select>
                           </div>

                           {/* Start Date */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Start Date *</label>
                               <input 
                                   type="date" 
                                   value={startDate} 
                                   onChange={e => setStartDate(e.target.value)} 
                                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                               />
                           </div>

                           {/* End Date */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">End Date *</label>
                               <input 
                                   type="date" 
                                   value={endDate} 
                                   onChange={e => setEndDate(e.target.value)} 
                                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                               />
                           </div>

                           {/* Contract Template Selector */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Contract Template *</label>
                               <Select value={contractTemplate} onValueChange={val => setContractTemplate(val)}>
                                   <SelectTrigger className="w-full p-2">
                                       <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="Standard Service Agreement">Standard Service Agreement</SelectItem>
                                       <SelectItem value="Custom Logistics Rider">Custom Logistics Rider</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>

                           {/* Status */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Status *</label>
                               <Select value={status} onValueChange={val => setStatus(val as CustomerContract['status'])}>
                                   <SelectTrigger className="w-full p-2">
                                       <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="Draft">Draft</SelectItem>
                                       <SelectItem value="Active">Active</SelectItem>
                                       <SelectItem value="Terminated">Terminated</SelectItem>
                                       <SelectItem value="Expired">Expired</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>
                        </div>

                        <div className="mt-8 border-t dark:border-gray-700 pt-6">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">Contracted Services</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-left">
                                        <tr>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-12">No.</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Service Name</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Description</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-24 text-right">Quantity</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-40">Unit</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-32 text-right">Rate ($)</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-40 text-right">Amount ($)</th>
                                            <th className="p-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => {
                                            const amount = item.quantity * item.rate;
                                            return (
                                            <tr key={item.id} className="border-b dark:border-gray-700">
                                                <td className="p-2 text-gray-700 dark:text-gray-300">{index + 1}</td>
                                                <td className="p-1">
                                                    <input 
                                                        type="text" 
                                                        value={item.serviceName} 
                                                        onChange={e => handleItemChange(item.id, 'serviceName', e.target.value)} 
                                                        className="w-full p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-1">
                                                    <input 
                                                        type="text" 
                                                        value={item.description} 
                                                        onChange={e => handleItemChange(item.id, 'description', e.target.value)} 
                                                        className="w-full p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-1">
                                                    <input 
                                                        type="number" 
                                                        value={item.quantity} 
                                                        onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} 
                                                        className="w-full p-1.5 text-right rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-1">
                                                    <Select value={item.unit} onValueChange={val => handleItemChange(item.id, 'unit', val)}>
                                                        <SelectTrigger className="w-full p-1.5">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Per Shipment">Per Shipment</SelectItem>
                                                            <SelectItem value="Per Container">Per Container</SelectItem>
                                                            <SelectItem value="Per Hour">Per Hour</SelectItem>
                                                            <SelectItem value="Fixed">Fixed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-1">
                                                    <input 
                                                        type="number" 
                                                        value={item.rate} 
                                                        onChange={e => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} 
                                                        className="w-full p-1.5 text-right rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-2 text-right text-gray-800 font-medium dark:text-gray-200">{formatCurrency(amount)}</td>
                                                <td className="p-2 text-center">
                                                    {items.length > 1 &&
                                                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
                                                            <XIcon className="w-4 h-4"/>
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-between items-start">
                                <button onClick={handleAddItem} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">+ Add Row</button>
                                <div className="w-1/3 space-y-2 text-right">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Total</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(totalValue)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base">
                                        <span className="text-gray-800 dark:text-gray-100">Grand Total</span>
                                        <span className="text-gray-900 dark:text-white">{formatCurrency(totalValue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="mt-8 border-t dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Terms and Conditions</h3>
                            <textarea 
                                value={termsText} 
                                onChange={e => setTermsText(e.target.value)} 
                                rows={4}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                            />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerContractDetailView;
