

import React, { useState } from 'react';
import type { Shipment, ShipmentStatus } from '../types';
import { 
    ArrowLeftIcon, 
    PrinterIcon, 
    DotsHorizontalIcon,
    PlusIcon,
    DocumentReportIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    AlignLeftIcon,
    AlignRightIcon,
} from '../constants';

interface ShipmentDetailViewProps {
    shipment: Shipment;
    onBack: () => void;
    isSubPanelOpen: boolean;
    toggleSubPanel: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
);

const TimelineItem: React.FC<{ status: string; isCompleted: boolean; isCurrent: boolean; }> = ({ status, isCompleted, isCurrent }) => (
    <li className="relative flex items-start">
        <div className="flex h-9 items-center">
            <div className={`relative flex h-6 w-6 items-center justify-center rounded-full ${isCompleted || isCurrent ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                {isCompleted && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                {isCurrent && <div className="h-2.5 w-2.5 rounded-full bg-white"></div>}
            </div>
        </div>
        <div className="ml-4 min-w-0">
            <p className={`font-medium ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{status}</p>
        </div>
    </li>
);

const ShipmentDetailView: React.FC<ShipmentDetailViewProps> = ({ shipment, onBack, isSubPanelOpen, toggleSubPanel }) => {
    const [activeTab, setActiveTab] = useState("Overview");
    const [isHovered, setIsHovered] = useState(false);
    const tabs = ["Overview", "Documents", "Financials"];
    
    const timelineStatuses: ShipmentStatus[] = ['Booked', 'In Transit', 'Customs Clearance', 'Delivered'];
    const currentStatusIndex = timelineStatuses.indexOf(shipment.status);

    const getStatusBadge = (status: Shipment['status']) => {
        switch (status) {
            case 'In Transit': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{status}</Badge>;
            case 'Customs Clearance': return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">{status}</Badge>;
            case 'Delivered': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{status}</Badge>;
            case 'Booked': return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">{status}</Badge>;
            case 'On Hold': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{status}</Badge>;
            default: return null;
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-6 py-3">
                <div className="flex items-center space-x-4">
                     <button
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      onClick={toggleSubPanel}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      aria-label={isSubPanelOpen ? 'Collapse sidebar' : 'Expand sidebar'}
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
                     <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {shipment.shipmentId}
                    </h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Update Status</button>
                    <button className="p-2 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"><PrinterIcon className="h-4 w-4"/></button>
                    <button className="p-2 rounded hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"><DotsHorizontalIcon className="h-4 w-4"/></button>
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">Save</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 space-x-6 overflow-hidden p-6">
                {/* Left Content */}
                <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-start">
                             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shipment Overview</h2>
                             {getStatusBadge(shipment.status)}
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
                            <DetailItem label="Client Name" value={<a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">{shipment.clientName}</a>} />
                            <DetailItem label="Mode of Transport" value={shipment.mode} />
                            <DetailItem label="Origin" value={shipment.origin} />
                            <DetailItem label="Destination" value={shipment.destination} />
                            <DetailItem label="Estimated Departure (ETD)" value={shipment.etd} />
                            <DetailItem label="Estimated Arrival (ETA)" value={shipment.eta} />
                        </div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
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
                        
                        <div className="p-6">
                            {activeTab === 'Overview' && <div>Content for overview...</div>}
                            {activeTab === 'Documents' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold dark:text-gray-100">Attached Documents</h3>
                                        <button className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"><PlusIcon className="h-4 w-4" /><span>Upload</span></button>
                                    </div>
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <li className="flex items-center justify-between py-3">
                                            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200"><DocumentReportIcon className="h-5 w-5 text-gray-500 dark:text-gray-400"/><span>Bill_of_Lading_Final.pdf</span></div>
                                            <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Download</a>
                                        </li>
                                        <li className="flex items-center justify-between py-3">
                                            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200"><DocumentReportIcon className="h-5 w-5 text-gray-500 dark:text-gray-400"/><span>Commercial_Invoice_REX001.pdf</span></div>
                                            <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Download</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'Financials' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2 dark:text-gray-100">Client Invoicing</h3>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700/50">
                                            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200"><ClipboardDocumentListIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" /><span>INV-2024-07-005</span></div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">$12,500.00</span>
                                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Paid</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 dark:text-gray-100">Vendor Bills</h3>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700/50">
                                            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200"><CurrencyDollarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" /><span>MAERSK-BILL-987</span></div>
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">$8,200.00</span>
                                            <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Pending Payment</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Timeline */}
                <aside className={`w-72 flex-shrink-0 ${!isSubPanelOpen ? 'hidden' : ''}`}>
                     <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shipment Timeline</h3>
                         <ul className="mt-6 space-y-4">
                            {timelineStatuses.map((status, index) => (
                                <TimelineItem 
                                    key={status} 
                                    status={status}
                                    isCompleted={index < currentStatusIndex}
                                    isCurrent={index === currentStatusIndex}
                                />
                            ))}
                         </ul>
                     </div>
                </aside>
            </div>
        </div>
    );
};

export default ShipmentDetailView;