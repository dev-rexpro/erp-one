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
    FilterIcon,
    ArrowUpDownIcon,
    PlusIcon,
    ShipIcon,
    TruckIcon,
    XIcon
} from '../constants';
import type { Shipment } from '../types';
import { SHIPMENTS_DATA } from '../constants';
import { Plane } from 'lucide-react';

interface ShipmentListViewProps {
    onShipmentSelect: (shipmentId: string) => void;
    isSubPanelOpen: boolean;
    toggleSubPanel: () => void;
}

const ShipmentListView: React.FC<ShipmentListViewProps> = ({ 
    onShipmentSelect, 
    isSubPanelOpen, 
    toggleSubPanel 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [modeFilter, setModeFilter] = useState<string>('all');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const getStatusBadge = (status: Shipment['status']) => {
        const baseClasses = "text-[10px] font-semibold px-2.5 py-0.5 rounded-full";
        switch (status) {
            case 'In Transit': 
                return <span className={`bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ${baseClasses}`}>{status}</span>;
            case 'Customs Clearance': 
                return <span className={`bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 ${baseClasses}`}>{status}</span>;
            case 'Delivered': 
                return <span className={`bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ${baseClasses}`}>{status}</span>;
            case 'Booked': 
                return <span className={`bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ${baseClasses}`}>{status}</span>;
            case 'On Hold': 
                return <span className={`bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ${baseClasses}`}>{status}</span>;
            default: 
                return <span className={`bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 ${baseClasses}`}>{status}</span>;
        }
    };

    const getModeIcon = (mode: Shipment['mode']) => {
        switch (mode) {
            case 'Sea': return <ShipIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
            case 'Air': return <Plane className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
            case 'Land': return <TruckIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
            default: return null;
        }
    }

    const filteredShipments = SHIPMENTS_DATA.filter(shipment => {
        const matchesSearch = 
            shipment.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shipment.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
        const matchesMode = modeFilter === 'all' || shipment.mode === modeFilter;
        
        return matchesSearch && matchesStatus && matchesMode;
    }).slice(0, itemsPerPage);

    return (
        <div className="flex h-screen w-full flex-col bg-white dark:bg-gray-950 p-4 overflow-hidden">
            <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col overflow-hidden shadow-sm">
                
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Shipments</h1>
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
                        <Button className="h-9 px-4 font-semibold bg-gray-900 text-white hover:bg-gray-800 gap-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <PlusIcon className="h-4 w-4" />
                            <span>New Shipment</span>
                        </Button>
                    </div>
                </div>
                
                <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-2.5 dark:border-gray-800 bg-white dark:bg-gray-900 z-20">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="relative flex items-center w-full max-w-sm">
                            <Input 
                                type="text" 
                                placeholder="Search Shipment ID or Client..." 
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
                                    <SelectItem value="In Transit">In Transit</SelectItem>
                                    <SelectItem value="Customs Clearance">Customs</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Booked">Booked</SelectItem>
                                    <SelectItem value="On Hold">On Hold</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={modeFilter} onValueChange={setModeFilter}>
                                <SelectTrigger className="h-9 w-36 bg-gray-50/50 dark:bg-gray-800 text-xs">
                                    <SelectValue placeholder="Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modes</SelectItem>
                                    <SelectItem value="Sea">Sea</SelectItem>
                                    <SelectItem value="Air">Air</SelectItem>
                                    <SelectItem value="Land">Land</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" className="h-9 gap-2 text-gray-700 dark:text-gray-300 bg-gray-50/50 hover:bg-gray-100">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span>Sort</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span>{filteredShipments.length} of {SHIPMENTS_DATA.length} Shipments</span>
                    </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 relative w-full bg-white dark:bg-gray-900 custom-scrollbar">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400 border-collapse">
                        <thead className="text-xs uppercase text-gray-500 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 shadow-[inset_0_-1px_0_#e5e7eb] dark:shadow-[inset_0_-1px_0_#1f2937]">
                            <tr>
                                <th scope="col" className="p-3 w-12"><Checkbox className="rounded border-gray-300" /></th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Shipment ID</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Client</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Route</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider text-center">Mode</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">ETD</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider">ETA</th>
                                <th scope="col" className="px-4 py-2.5 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShipments.map(shipment => (
                                <tr key={shipment.id} className="bg-white border-b border-gray-100 hover:bg-gray-50/80 transition-colors dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800/50 group">
                                    <td className="w-4 p-3"><Checkbox className="rounded border-gray-300"/></td>
                                    <td className="px-4 py-1.5 whitespace-nowrap">
                                        <button onClick={() => onShipmentSelect(shipment.id)} className="font-semibold text-gray-900 dark:text-white hover:underline transition-all">
                                            {shipment.shipmentId}
                                        </button>
                                    </td>
                                    <td className="px-4 py-1.5 font-medium text-gray-800 dark:text-gray-200">{shipment.clientName}</td>
                                    <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300">
                                        {shipment.origin} &rarr; {shipment.destination}
                                    </td>
                                    <td className="px-4 py-1.5">
                                        {getStatusBadge(shipment.status)}
                                    </td>
                                    <td className="px-4 py-1.5 flex justify-center items-center h-full pt-2">
                                        {getModeIcon(shipment.mode)}
                                    </td>
                                    <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300">{shipment.etd}</td>
                                    <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300">{shipment.eta}</td>
                                    <td className="px-4 py-1.5">
                                        <div className="flex items-center justify-end space-x-3 text-gray-400">
                                            <span className="text-[11px] whitespace-nowrap">{shipment.lastUpdated}</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DotsHorizontalIcon className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredShipments.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center text-gray-500 bg-gray-50/30 dark:bg-gray-800/20">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">No shipments found</p>
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
                        Showing <span className="font-medium text-gray-900 dark:text-white">{filteredShipments.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{SHIPMENTS_DATA.length}</span> entries
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

export default ShipmentListView;