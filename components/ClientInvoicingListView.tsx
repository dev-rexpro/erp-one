
import React, { useState } from 'react';
import {
    ChevronDownIcon,
    ListIcon,
    RefreshIcon,
    DotsHorizontalIcon,
    FilterIcon,
    XIcon,
    ArrowUpDownIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    AlignLeftIcon,
    AlignRightIcon,
} from '../constants';
import type { Invoice } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface ClientInvoicingListViewProps {
    invoices: Invoice[];
    onInvoiceSelect: (invoiceId: string) => void;
    onNewInvoice: () => void;
}

const ClientInvoicingListView: React.FC<ClientInvoicingListViewProps> = ({ invoices, onInvoiceSelect, onNewInvoice }) => {
    const [isSubPanelOpen, setIsSubPanelOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [customerFilter, setCustomerFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const getStatusBadge = (status: Invoice['status']) => {
        const baseClasses = "text-xs font-medium me-2 px-2.5 py-0.5 rounded-full";
        switch (status) {
            case 'Paid': return <span className={`bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ${baseClasses}`}>{status}</span>;
            case 'Unpaid': return <span className={`bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 ${baseClasses}`}>{status}</span>;
            case 'Overdue': return <span className={`bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ${baseClasses}`}>{status}</span>;
            case 'Draft': return <span className={`bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ${baseClasses}`}>{status}</span>;
            default: return null;
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-1 overflow-hidden">
                {/* Filter Sidebar */}
                <aside className={`w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${!isSubPanelOpen ? 'hidden' : 'mr-6'}`}>
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Filter By</h3>
                        <div className="space-y-2">
                            <label htmlFor="customer-name" className="sr-only">Customer Name</label>
                            <Select value={customerFilter} onValueChange={val => setCustomerFilter(val)} disabled>
                                <SelectTrigger className="w-full p-2">
                                    <SelectValue placeholder="Customer Name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="placeholder" disabled>No items</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="status" className="sr-only">Status</label>
                            <Select value={statusFilter} onValueChange={val => setStatusFilter(val)} disabled>
                                <SelectTrigger className="w-full p-2">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="placeholder" disabled>No items</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <button className="text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">Edit Filters</button>
                        <div className="space-y-2 border-t pt-4 dark:border-gray-600">
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Save Filter</h3>
                            <label htmlFor="filter-name" className="sr-only">Filter Name</label>
                            <input type="text" id="filter-name" placeholder="Filter Name" className="w-full rounded-md border-gray-300 bg-gray-100 p-2 text-sm placeholder-gray-500 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                    {/* Header Actions */}
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center space-x-2">
                            <button
                                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                onClick={() => setIsSubPanelOpen(!isSubPanelOpen)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {isHovered ? (
                                    isSubPanelOpen ? (
                                        <ChevronDoubleLeftIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronDoubleRightIcon className="h-5 w-5" />
                                    )
                                ) : isSubPanelOpen ? (
                                    <AlignLeftIcon className="h-5 w-5" />
                                ) : (
                                    <AlignRightIcon className="h-5 w-5" />
                                )}
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Client Invoices</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                                <ListIcon className="h-4 w-4" /><span>List View</span><ChevronDownIcon className="h-4 w-4" />
                            </button>
                            <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"><RefreshIcon className="h-4 w-4" /></button>
                            <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"><DotsHorizontalIcon className="h-4 w-4" /></button>
                            <button onClick={onNewInvoice} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">+ New Invoice</button>
                        </div>
                    </div>
                    
                    {/* Table Actions */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                                <FilterIcon className="h-4 w-4" /><span>Filter</span>
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md dark:text-gray-400 dark:hover:bg-gray-700"><XIcon className="h-4 w-4" /></button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md dark:text-gray-400 dark:hover:bg-gray-700"><ArrowUpDownIcon className="h-4 w-4" /></button>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Invoice Date</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span>{invoices.length} of {invoices.length}</span>
                        </div>
                    </div>

                    {/* Invoices Table */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs uppercase text-gray-700 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 border-b dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="p-4"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /></th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Invoice #</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Billed To</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                                    <th scope="col" className="px-6 py-3 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(invoice => (
                                    <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50">
                                        <td className="w-4 p-4"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600"/></td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                                            <button onClick={() => onInvoiceSelect(invoice.id)} className="text-gray-900 hover:underline dark:text-gray-100">
                                                {invoice.invoiceNumber}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">{invoice.billedToName}</td>
                                        <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                                        <td className="px-6 py-4">{invoice.invoiceDate}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 text-right dark:text-white">{formatCurrency(invoice.totalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientInvoicingListView;
