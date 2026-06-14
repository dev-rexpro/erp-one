import React, { useState, useEffect } from 'react';
import type { Quotation, QuotationItem, Customer } from '../types';
import { 
    ChevronDownIcon,
    DotsHorizontalIcon,
    XIcon,
    ArrowLeftIcon
} from '../constants';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface QuotationDetailViewProps {
    quotation: Quotation | null; // Null for new quotation
    onBack: () => void;
    onSave: (updated: Quotation) => void;
}

const QuotationDetailView: React.FC<QuotationDetailViewProps> = ({ quotation, onBack, onSave }) => {
    const isNew = !quotation;
    const [activeTab, setActiveTab] = useState("Details");
    const tabs = ["Details", "Address & Contact", "Terms", "More Info"];

    // Dynamic Customer List for selection
    const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const cached = localStorage.getItem('CUSTOMERS_DATA');
        if (cached) {
            setAvailableCustomers(JSON.parse(cached));
        }
    }, []);

    // Form inputs state
    const [clientName, setClientName] = useState(quotation ? quotation.clientName : '');
    const [status, setStatus] = useState<Quotation['status']>(quotation ? quotation.status : 'Draft');
    const [date, setDate] = useState(quotation ? quotation.date : new Date().toISOString().split('T')[0]);
    const [series, setSeries] = useState('SAL-QTN-.YYYY.-');
    const [orderType, setOrderType] = useState('Sales');
    const [validTill, setValidTill] = useState(quotation ? '2025-09-14' : '');
    const [company, setCompany] = useState('RXCorp Industries');

    const [items, setItems] = useState<QuotationItem[]>([]);

    useEffect(() => {
        if (!isNew && quotation) {
            // Load items or set defaults
            setItems([
                { id: 1, itemCode: 'SRV-001', quantity: 10, rate: 6600 }
            ]);
        } else {
            setItems([{ id: 1, itemCode: 'FREIGHT-SEA', quantity: 1, rate: 1200 }]);
        }
    }, [isNew, quotation]);
    
    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), itemCode: 'SRV-CUSTOM', quantity: 1, rate: 100 }]);
    };

    const handleItemChange = (id: number, field: keyof Omit<QuotationItem, 'id'>, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handleSave = () => {
        if (!clientName) {
            alert('Please select or specify a Customer Name.');
            return;
        }

        const grandTotalVal = calculateGrandTotal();
        const activeQuotation: Quotation = {
            id: quotation ? quotation.id : String(Date.now()),
            clientName,
            status,
            date,
            grandTotal: formatCurrency(grandTotalVal),
            quotationId: quotation ? quotation.quotationId : `QTN-${date.substring(0, 4)}-${Math.floor(Math.random() * 900) + 100}`,
            comments: quotation ? quotation.comments : 0,
            likes: quotation ? quotation.likes : 0
        };

        onSave(activeQuotation);
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
                        aria-label="Back to Quotation list"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {isNew ? 'New Quotation' : quotation?.quotationId}
                        {isNew && <span className="ml-3 rounded-md bg-orange-100 px-2 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">Not Saved</span>}
                    </h1>
                 </div>
                <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                        <span>Get Items From</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"><DotsHorizontalIcon className="h-4 w-4"/></button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm"
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                           {/* Company Input */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Company *</label>
                               <input 
                                   type="text" 
                                   value={company} 
                                   onChange={e => setCompany(e.target.value)} 
                                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                               />
                           </div>

                           {/* Date Input */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Date *</label>
                               <input 
                                   type="date" 
                                   value={date} 
                                   onChange={e => setDate(e.target.value)} 
                                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                               />
                           </div>

                           {/* Series Selector */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Series *</label>
                               <Select value={series} onValueChange={val => setSeries(val)}>
                                   <SelectTrigger className="w-full p-2">
                                       <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="SAL-QTN-.YYYY.-">SAL-QTN-.YYYY.-</SelectItem>
                                       <SelectItem value="QTN-.YYYY.-">QTN-.YYYY.-</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>

                           {/* Order Type */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Order Type *</label>
                               <Select value={orderType} onValueChange={val => setOrderType(val)}>
                                   <SelectTrigger className="w-full p-2">
                                       <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="Sales">Sales</SelectItem>
                                       <SelectItem value="Maintenance">Maintenance</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>

                           {/* Customer Select Option */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Customer *</label>
                               <Select value={clientName} onValueChange={val => setClientName(val)}>
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

                           {/* Valid Till */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Valid Till</label>
                               <input 
                                   type="date" 
                                   value={validTill} 
                                   onChange={e => setValidTill(e.target.value)} 
                                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-800 dark:text-white"
                               />
                           </div>

                           {/* Status Selector */}
                           <div>
                               <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Status *</label>
                               <Select value={status} onValueChange={val => setStatus(val as Quotation['status'])}>
                                   <SelectTrigger className="w-full p-2">
                                       <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="Draft">Draft</SelectItem>
                                       <SelectItem value="Open">Open</SelectItem>
                                       <SelectItem value="Cancelled">Cancelled</SelectItem>
                                       <SelectItem value="Expired">Expired</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>
                        </div>

                        <div className="mt-8 border-t dark:border-gray-700 pt-6">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">Line Items</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-700 text-left">
                                        <tr>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-16">No.</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300">Item Code</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-32 text-right">Quantity</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-48 text-right">Rate ($)</th>
                                            <th className="p-2 font-semibold text-gray-600 dark:text-gray-300 w-48 text-right">Amount ($)</th>
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
                                                        value={item.itemCode || ''} 
                                                        onChange={e => handleItemChange(item.id, 'itemCode', e.target.value)} 
                                                        placeholder="Item service code"
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
                            <div className="mt-4 flex items-center justify-between border-b pb-4 dark:border-gray-700">
                                <button onClick={handleAddItem} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">+ Add Row</button>
                                <div className="text-right">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">Total Value:</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(calculateGrandTotal())}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetailView;
