import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
    ChevronDownIcon,
    ListIcon,
    RefreshIcon,
    DotsHorizontalIcon,
    FilterIcon,
    ArrowUpDownIcon,
    CommentIcon,
    HeartIcon
} from '../constants';
import type { Customer } from '../types';

interface CustomerManagementViewProps {
    customers: Customer[];
    onCustomerSelect: (customer: Customer) => void;
    onAddNew: () => void;
}

const CustomerManagementView: React.FC<CustomerManagementViewProps> = ({ 
    customers, 
    onCustomerSelect, 
    onAddNew
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredCustomers = customers.filter(customer => {
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.group.toLowerCase().includes(query) ||
            customer.id.includes(query) ||
            customer.originalId.toLowerCase().includes(query)
        );
    }).slice(0, itemsPerPage);
    
    return (
        <div className="flex h-screen w-full flex-col dark:bg-gray-950 p-4 overflow-hidden">
            <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col overflow-hidden shadow-sm">
                
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Customer</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="h-9 gap-2 font-medium text-gray-700 dark:text-gray-300">
                            <ListIcon className="h-4 w-4"/>
                            <span>List View</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
                            <RefreshIcon className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1 font-semibold text-gray-700 dark:text-gray-300">
                                    <span>Action</span>
                                    <ChevronDownIcon className="h-4 w-4 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700" onClick={() => toast.success('Exporting customer database...')}>
                                    Export Customers
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700" onClick={() => toast.info('Please upload CSV to import customers')}>
                                    Import Customers (CSV)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => toast.error('Bulk delete is not active. Select rows to delete.')}>
                                    Bulk Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={onAddNew} className="h-9 px-4 font-semibold bg-gray-900 text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                            + Add Customer
                        </Button>
                    </div>
                </div>
                
                <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-2.5 dark:border-gray-800 bg-white dark:bg-gray-900 z-20">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="relative flex items-center w-full max-w-sm">
                            <Input 
                                type="text" 
                                placeholder="Search Customer or ID..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 w-full bg-gray-50/50 dark:bg-gray-800"
                            />
                            {searchQuery && (
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setSearchQuery('')} 
                                    className="absolute right-1 h-7 px-2 text-xs text-gray-400 hover:text-gray-700"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="h-9 gap-2 text-gray-700 dark:text-gray-300 bg-gray-50/50 hover:bg-gray-100">
                                <FilterIcon className="h-4 w-4"/>
                                <span>Filter</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 gap-2 text-gray-700 dark:text-gray-300 bg-gray-50/50 hover:bg-gray-100">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span>Sort</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span className="hidden sm:inline-block">Last Updated On</span>
                        <span className="h-4 border-l border-gray-300 dark:border-gray-700"></span>
                        <span>{filteredCustomers.length} of {customers.length}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                            <HeartIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 relative w-full bg-white dark:bg-gray-900 custom-scrollbar">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400 border-collapse">
                        <thead className="text-xs uppercase text-gray-500 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 shadow-[inset_0_-1px_0_#e5e7eb] dark:shadow-[inset_0_-1px_0_#1f2937]">
                            <tr>
                                <th scope="col" className="p-3 w-12"><Checkbox className="rounded border-gray-300" /></th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Customer Name</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Customer Group</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">ID</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="bg-white border-b border-gray-100 hover:bg-gray-50/80 transition-colors dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800/50 group">
                                    <td className="w-4 p-3"><Checkbox className="rounded border-gray-300"/></td>
                                    <td className="px-4 py-1.5 whitespace-nowrap">
                                        <button onClick={() => onCustomerSelect(customer)} className="font-semibold text-gray-900 dark:text-white hover:underline transition-all">
                                            {customer.name}
                                        </button>
                                    </td>
                                    <td className="px-4 py-1.5">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                            customer.status === 'Enabled' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300">{customer.group}</td>
                                    <td className="px-4 py-1.5 text-gray-500">{customer.id}</td>
                                    <td className="px-4 py-1.5">
                                        <div className="flex items-center justify-end space-x-4 text-gray-400">
                                            {customer.initials && (
                                                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center">{customer.initials}</span>
                                            )}
                                            <span className="text-xs whitespace-nowrap">{customer.lastUpdated}</span>
                                            <div className="flex items-center space-x-1 hover:text-gray-700 cursor-pointer transition-colors">
                                                <CommentIcon className="w-4 h-4"/>
                                                <span className="text-xs">{customer.comments}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                                                <HeartIcon className="w-4 h-4"/>
                                                <span className="text-xs">{customer.likes}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DotsHorizontalIcon className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-500 bg-gray-50/30 dark:bg-gray-800/20">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">No customers found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </ScrollArea>

                <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 z-20">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900 dark:text-white">{filteredCustomers.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{customers.length}</span> entries
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600 dark:text-gray-400">Records per page</label>
                        <Select 
                            value={String(itemsPerPage)} 
                            onValueChange={(value) => setItemsPerPage(Number(value))}
                        >
                            <SelectTrigger className="w-20 h-8 text-sm bg-white dark:bg-gray-800">
                                <SelectValue placeholder={String(itemsPerPage)} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagementView;