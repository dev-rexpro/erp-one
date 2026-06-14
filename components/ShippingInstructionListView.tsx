import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ChevronDownIcon,
    ListIcon,
    RefreshIcon,
    DotsHorizontalIcon,
    ArrowUpDownIcon,
    CommentIcon,
    HeartIcon
} from '../constants';
import type { ShippingInstruction } from '../types';

interface ShippingInstructionListViewProps {
    shippingInstructions: ShippingInstruction[];
    onSiSelect: (siId: string) => void;
    onNewSi: () => void;
}

const ShippingInstructionListView: React.FC<ShippingInstructionListViewProps> = ({ 
    shippingInstructions, 
    onSiSelect, 
    onNewSi 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [forwarderFilter, setForwarderFilter] = useState('all');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const getStatusBadge = (status: ShippingInstruction['status']) => {
        const baseClasses = "text-[10px] font-semibold px-2.5 py-0.5 rounded-full";
        switch (status) {
            case 'Confirmed': 
                return <span className={`bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ${baseClasses}`}>{status}</span>;
            case 'Cancelled': 
                return <span className={`bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ${baseClasses}`}>{status}</span>;
            case 'Draft': 
                return <span className={`bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ${baseClasses}`}>{status}</span>;
            case 'Sent': 
                return <span className={`bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ${baseClasses}`}>{status}</span>;
            default: 
                return <span className={`bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 ${baseClasses}`}>{status}</span>;
        }
    };

    const filteredInstructions = shippingInstructions.filter(si => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            si.shippingInstructionNumber.toLowerCase().includes(query) ||
            si.toParty.toLowerCase().includes(query) ||
            si.consigneeName.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'all' || si.status === statusFilter;
        const matchesForwarder = forwarderFilter === 'all' || si.toParty === forwarderFilter;

        return matchesSearch && matchesStatus && matchesForwarder;
    }).slice(0, itemsPerPage);
    
    return (
        <div className="flex h-screen w-full flex-col p-4 overflow-hidden">
            <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col overflow-hidden shadow-sm">
                
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-gray-800">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Shipping Instructions</h1>
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
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                        <Button onClick={onNewSi} className="h-9 px-4 font-semibold bg-gray-900 text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                            + New SI
                        </Button>
                    </div>
                </div>
                
                <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-2.5 dark:border-gray-800 z-20">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="relative flex items-center w-full max-w-sm">
                            <Input 
                                type="text" 
                                placeholder="Search SI #, Forwarder, or Consignee..." 
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
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 w-36 bg-gray-50/50 dark:bg-gray-800 text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={forwarderFilter} onValueChange={setForwarderFilter}>
                                <SelectTrigger className="h-9 w-36 bg-gray-50/50 dark:bg-gray-800 text-xs">
                                    <SelectValue placeholder="Forwarder" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Forwarders</SelectItem>
                                    {Array.from(new Set(shippingInstructions.map(si => si.toParty))).map(f => (
                                        <SelectItem key={f} value={f}>{f}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" className="h-9 gap-2 text-gray-700 dark:text-gray-300 bg-gray-50/50 hover:bg-gray-100">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span>Sort</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span>{filteredInstructions.length} of {shippingInstructions.length} Instructions</span>
                    </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 relative w-full bg-white dark:bg-gray-900 custom-scrollbar">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400 border-collapse">
                        <thead className="text-xs uppercase text-gray-500 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 shadow-[inset_0_-1px_0_#e5e7eb] dark:shadow-[inset_0_-1px_0_#1f2937]">
                            <tr>
                                <th scope="col" className="p-3 w-12"><Checkbox className="rounded border-gray-300" /></th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">SI #</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Date</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Forwarder</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Consignee</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInstructions.map(si => (
                                <tr key={si.id} className="bg-white border-b border-gray-100 hover:bg-gray-50/80 transition-colors dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800/50 group">
                                    <td className="w-4 p-3"><Checkbox className="rounded border-gray-300"/></td>
                                    <td className="px-4 py-1.5 whitespace-nowrap">
                                        <button onClick={() => onSiSelect(si.id)} className="font-semibold text-gray-900 dark:text-white hover:underline transition-all">
                                            {si.shippingInstructionNumber}
                                        </button>
                                    </td>
                                    <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300">{si.shippingInstructionDate}</td>
                                    <td className="px-4 py-1.5 font-medium text-gray-800 dark:text-gray-200">{si.toParty}</td>
                                    <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300">{si.consigneeName}</td>
                                    <td className="px-4 py-1.5">
                                        {getStatusBadge(si.status)}
                                    </td>
                                    <td className="px-4 py-1.5">
                                        <div className="flex items-center justify-end space-x-3 text-gray-400">
                                            <div className="flex items-center space-x-1 hover:text-gray-700 cursor-pointer transition-colors">
                                                <CommentIcon className="w-4 h-4"/>
                                                <span className="text-xs">0</span>
                                            </div>
                                            <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                                                <HeartIcon className="w-4 h-4"/>
                                                <span className="text-xs">0</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DotsHorizontalIcon className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInstructions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-gray-500 bg-gray-50/30 dark:bg-gray-800/20">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">No instructions found</p>
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
                        Showing <span className="font-medium text-gray-900 dark:text-white">{filteredInstructions.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{shippingInstructions.length}</span> entries
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

export default ShippingInstructionListView;