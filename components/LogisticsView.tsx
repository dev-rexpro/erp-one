import React, { useState, useEffect } from 'react';
import type { Breadcrumb, Shipment, PackingList, ShippingInstruction } from '../types';
import OperationsDashboard from './OperationsDashboard';
import ShipmentListView from './ShipmentListView';
import ShipmentDetailView from './ShipmentDetailView';
import PackingListView from './PackingListView';
import PackingListDetailView from './PackingListDetailView';
import ShippingInstructionListView from './ShippingInstructionListView';
import ShippingInstructionDetailView from './ShippingInstructionDetailView';
import { SHIPMENTS_DATA, PACKING_LISTS_DATA, SHIPPING_INSTRUCTIONS_DATA } from '../constants';
import { Anchor, Compass, Hourglass, Landmark, MapPin, Search, Ship, Timer, Trash2, Edit2, Plus, Calendar } from 'lucide-react';

interface TrackingStatus {
    containerNo: string;
    vessel: string;
    voyage: string;
    origin: string;
    destination: string;
    etaDate: string;
    carrier: string;
    currentMilestone: 'POL' | 'Sailing' | 'Transit' | 'POD' | 'Customs' | 'Delivered';
    logs: { time: string; activity: string; location: string }[];
}

interface DemurrageCase {
    id: string;
    containerNo: string;
    bookingNo: string;
    carrier: string;
    dischargeDate: string;
    freeDays: number;
    currentDays: number;
    dailyRateUsd: number;
    port: string;
    status: 'Safe' | 'Warning' | 'Overdue';
}

interface LogisticsViewProps {
    activeSubView: string | null;
    setActiveView: (view: string) => void;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const LogisticsView: React.FC<LogisticsViewProps> = ({
    activeSubView,
    setActiveView,
    setActiveSubView,
    setBreadcrumbs,
    isSidebarOpen,
    setIsSidebarOpen
}) => {
    // -------------------------------------------------------------------------
    // Persistent Logistics state
    // -------------------------------------------------------------------------
    const [shipments, setShipments] = useState<Shipment[]>(() => {
        const cached = localStorage.getItem('LOGISTICS_SHIPMENTS');
        return cached ? JSON.parse(cached) : SHIPMENTS_DATA;
    });

    const [packingLists, setPackingLists] = useState<PackingList[]>(() => {
        const cached = localStorage.getItem('LOGISTICS_PACKING_LISTS');
        return cached ? JSON.parse(cached) : PACKING_LISTS_DATA;
    });

    const [shippingInstructions, setShippingInstructions] = useState<ShippingInstruction[]>(() => {
        const cached = localStorage.getItem('LOGISTICS_SI');
        return cached ? JSON.parse(cached) : SHIPPING_INSTRUCTIONS_DATA;
    });

    const [demurrageCases, setDemurrageCases] = useState<DemurrageCase[]>(() => {
        const cached = localStorage.getItem('LOGISTICS_DEMURRAGE');
        return cached ? JSON.parse(cached) : [
            { id: 'DD-001', containerNo: 'MSKU9048392', bookingNo: 'BK-5012', carrier: 'MAERSK LINE', dischargeDate: '2026-06-01', freeDays: 7, currentDays: 5, dailyRateUsd: 120, port: 'Port of Tanjung Priok (IDTPP)', status: 'Safe' },
            { id: 'DD-002', containerNo: 'ONEY3029481', bookingNo: 'BK-5014', carrier: 'OCEAN NETWORK EXPRESS', dischargeDate: '2026-05-28', freeDays: 5, currentDays: 9, dailyRateUsd: 150, port: 'Port of Tanjung Perak (IDSUB)', status: 'Overdue' },
            { id: 'DD-003', containerNo: 'CMAU1203492', bookingNo: 'BK-5017', carrier: 'CMA CGM', dischargeDate: '2026-06-03', freeDays: 7, currentDays: 3, dailyRateUsd: 110, port: 'Port of Belawan (IDBLW)', status: 'Safe' },
            { id: 'DD-004', containerNo: 'MSCU7720348', bookingNo: 'BK-5020', carrier: 'MSC', dischargeDate: '2026-05-30', freeDays: 7, currentDays: 7, dailyRateUsd: 130, port: 'Port of Tanjung Priok (IDTPP)', status: 'Warning' },
        ];
    });

    // Tracking query data
    const trackingDatabase: TrackingStatus[] = [
        {
            containerNo: 'MSKU9048392',
            vessel: 'MAERSK MC-KINNEY MOLLER',
            voyage: '2604W',
            origin: 'Shanghai port (CNSHA)',
            destination: 'Tanjung Priok, Jakarta (IDTPP)',
            etaDate: '2026-06-08',
            carrier: 'MAERSK LINE',
            currentMilestone: 'Transit',
            logs: [
                { time: '2026-06-05 08:30', activity: 'Vessel departure from Shanghai Terminal 3', location: 'Shanghai (CNSHA)' },
                { time: '2026-06-06 14:00', activity: 'Ocean journey transit milestone reached', location: 'East China Sea' },
                { time: '2026-06-07 09:12', activity: 'Estimated approach transit channel', location: 'Singapore Strait' }
            ]
        },
        {
            containerNo: 'ONEY3029481',
            vessel: 'ONE HUMBER',
            voyage: '03W',
            origin: 'Yokohama port (JPYOK)',
            destination: 'Tanjung Perak, Surabaya (IDSUB)',
            etaDate: '2026-06-12',
            carrier: 'OCEAN NETWORK EXPRESS',
            currentMilestone: 'Sailing',
            logs: [
                { time: '2026-06-04 10:00', activity: 'Export customs cleared and gate-in cargo yard', location: 'Yokohama Yard' },
                { time: '2026-06-05 16:30', activity: 'Vessel departed load port terminal', location: 'Yokohama port (JPYOK)' }
            ]
        }
    ];

    // Synchronization
    useEffect(() => {
        localStorage.setItem('LOGISTICS_SHIPMENTS', JSON.stringify(shipments));
    }, [shipments]);

    useEffect(() => {
        localStorage.setItem('LOGISTICS_PACKING_LISTS', JSON.stringify(packingLists));
    }, [packingLists]);

    useEffect(() => {
        localStorage.setItem('LOGISTICS_SI', JSON.stringify(shippingInstructions));
    }, [shippingInstructions]);

    useEffect(() => {
        localStorage.setItem('LOGISTICS_DEMURRAGE', JSON.stringify(demurrageCases));
    }, [demurrageCases]);

    // -------------------------------------------------------------------------
    // Page view controllers
    // -------------------------------------------------------------------------
    const [shipmentViewState, setShipmentViewState] = useState<'list' | 'detail'>('list');
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [packingListViewState, setPackingListViewState] = useState<'list' | 'detail'>('list');
    const [selectedPackingList, setSelectedPackingList] = useState<PackingList | null>(null);
    const [siViewState, setSiViewState] = useState<'list' | 'detail'>('list');
    const [selectedSi, setSelectedSi] = useState<ShippingInstruction | null>(null);

    // Tracking flow
    const [trackQuery, setTrackQuery] = useState('MSKU9048392');
    const [matchedTrack, setMatchedTrack] = useState<TrackingStatus | null>(trackingDatabase[0]);

    // D&D states
    const [selectedDdCase, setSelectedDdCase] = useState<DemurrageCase | null>(null);
    const [isEditingDd, setIsEditingDd] = useState(false);
    const [isCreatingDd, setIsCreatingDd] = useState(false);
    const [ddForm, setDdForm] = useState<Partial<DemurrageCase>>({});

    const [isListSubPanelOpen, setIsListSubPanelOpen] = useState(() => {
        const saved = localStorage.getItem('isListSubPanelOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isDetailSubPanelOpen, setIsDetailSubPanelOpen] = useState(() => {
        const saved = localStorage.getItem('isDetailSubPanelOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('isListSubPanelOpen', JSON.stringify(isListSubPanelOpen));
    }, [isListSubPanelOpen]);

    useEffect(() => {
        localStorage.setItem('isDetailSubPanelOpen', JSON.stringify(isDetailSubPanelOpen));
    }, [isDetailSubPanelOpen]);



    const handleBackToModuleDashboard = () => {
        setActiveSubView('dashboard');
    };

    // -------------------------------------------------------------------------
    // Form & Data managers
    // -------------------------------------------------------------------------
    
    // Shipment List/Details
    const handleSelectShipment = (shipmentId: string) => {
        const shipment = shipments.find(s => s.id === shipmentId);
        if (shipment) {
            setSelectedShipment(shipment);
            setShipmentViewState('detail');
        }
    };

    const handleBackToShipmentList = () => {
        setSelectedShipment(null);
        setShipmentViewState('list');
    };

    // Packing Lists
    const handleSelectPackingList = (packingListId: string) => {
        const pl = packingLists.find(p => p.id === packingListId);
        if (pl) {
            setSelectedPackingList(pl);
            setPackingListViewState('detail');
        }
    };

    const handleNewPackingList = () => {
        setSelectedPackingList(null);
        setPackingListViewState('detail');
    };

    const handleBackToPackingList = () => {
        setSelectedPackingList(null);
        setPackingListViewState('list');
    };

    const handleSavePackingList = (savedPL: PackingList) => {
        const index = packingLists.findIndex(pl => pl.id === savedPL.id);
        if (index > -1) {
            setPackingLists(prev => prev.map(pl => pl.id === savedPL.id ? savedPL : pl));
        } else {
            setPackingLists(prev => [...prev, savedPL]);
        }
        setSelectedPackingList(savedPL);
    };

    // Shipping Instructions
    const handleSelectSi = (siId: string) => {
        const si = shippingInstructions.find(s => s.id === siId);
        if (si) {
            setSelectedSi(si);
            setSiViewState('detail');
        }
    };

    const handleNewSi = () => {
        setSelectedSi(null);
        setSiViewState('detail');
    };

    const handleBackToSiList = () => {
        setSelectedSi(null);
        setSiViewState('list');
    };

    const handleSaveSi = (savedSi: ShippingInstruction) => {
        const index = shippingInstructions.findIndex(si => si.id === savedSi.id);
        if (index > -1) {
            setShippingInstructions(prev => prev.map(si => si.id === savedSi.id ? savedSi : si));
        } else {
            setShippingInstructions(prev => [...prev, savedSi]);
        }
        setSelectedSi(savedSi);
    };

    // Tracking Trigger
    const executeTrackSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = trackingDatabase.find(t => t.containerNo.toLowerCase() === trackQuery.trim().toLowerCase());
        setMatchedTrack(found || null);
    };

    // Demurrage & Detention Handlers
    const openNewDdForm = () => {
        setDdForm({
            id: 'DD-' + Math.floor(Math.random() * 1000),
            containerNo: '',
            bookingNo: '',
            carrier: 'MAERSK LINE',
            dischargeDate: new Date().toISOString().split('T')[0],
            freeDays: 7,
            currentDays: 0,
            dailyRateUsd: 100,
            port: 'Port of Tanjung Priok (IDTPP)',
            status: 'Safe'
        });
        setIsCreatingDd(true);
        setIsEditingDd(false);
    };

    const openEditDdForm = (c: DemurrageCase) => {
        setSelectedDdCase(c);
        setDdForm({ ...c });
        setIsEditingDd(true);
        setIsCreatingDd(false);
    };

    const saveDdForm = (e: React.FormEvent) => {
        e.preventDefault();
        const input = ddForm as DemurrageCase;
        // Determine status
        if (input.currentDays > input.freeDays) {
            input.status = 'Overdue';
        } else if (input.currentDays === input.freeDays) {
            input.status = 'Warning';
        } else {
            input.status = 'Safe';
        }

        setDemurrageCases(prev => {
            const exists = prev.some(item => item.id === input.id);
            if (exists) {
                return prev.map(item => item.id === input.id ? input : item);
            } else {
                return [input, ...prev];
            }
        });
        setIsCreatingDd(false);
        setIsEditingDd(false);
        setSelectedDdCase(null);
    };

    const deleteDdCase = (id: string) => {
        if (confirm('Delete demurrage log entry?')) {
            setDemurrageCases(prev => prev.filter(c => c.id !== id));
        }
    };

    // Reset internal screens on active subview change
    useEffect(() => {
        if (activeSubView !== 'shipments-bookings') {
            setShipmentViewState('list');
            setSelectedShipment(null);
        }
        if (activeSubView !== 'cargo-manifests') {
            setPackingListViewState('list');
            setSelectedPackingList(null);
        }
        if (activeSubView !== 'shipping-instructions') {
            setSiViewState('list');
            setSelectedSi(null);
        }
    }, [activeSubView]);

    // Breadcrumbs management
    useEffect(() => {
        const baseCrumb: Breadcrumb = { label: 'Logistics', onClick: handleBackToModuleDashboard };

        if (activeSubView === 'shipments-bookings') {
            const shipmentListCrumb: Breadcrumb = { label: 'Shipments', onClick: handleBackToShipmentList };
            if (shipmentViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Shipments' }]);
            } else if (selectedShipment) {
                setBreadcrumbs([baseCrumb, shipmentListCrumb, { label: selectedShipment.shipmentId }]);
            }
        } else if (activeSubView === 'cargo-manifests') {
            const packingListCrumb: Breadcrumb = { label: 'Packing List', onClick: handleBackToPackingList };
            if (packingListViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Packing List' }]);
            } else if (selectedPackingList) {
                setBreadcrumbs([baseCrumb, packingListCrumb, { label: selectedPackingList.packingListNumber }]);
            } else {
                setBreadcrumbs([baseCrumb, packingListCrumb, { label: 'New Cargo Manifest' }]);
            }
        } else if (activeSubView === 'shipping-instructions') {
            const siListCrumb: Breadcrumb = { label: 'Shipping Instructions', onClick: handleBackToSiList };
            if (siViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Shipping Instructions' }]);
            } else if (selectedSi) {
                setBreadcrumbs([baseCrumb, siListCrumb, { label: selectedSi.shippingInstructionNumber }]);
            } else {
                setBreadcrumbs([baseCrumb, siListCrumb, { label: 'New Shipping Instruction' }]);
            }
        } else if (activeSubView === 'cargo-tracking') {
            setBreadcrumbs([baseCrumb, { label: 'Cargo Tracking' }]);
        } else if (activeSubView === 'demurrage-detention') {
            setBreadcrumbs([baseCrumb, { label: 'DnD Fee' }]);
        } else {
            setBreadcrumbs([{ label: 'Logistics' }]);
        }
    }, [activeSubView, shipmentViewState, selectedShipment, packingListViewState, selectedPackingList, siViewState, selectedSi, setBreadcrumbs]);

    // -------------------------------------------------------------------------
    // Renders
    // -------------------------------------------------------------------------
    if (activeSubView === 'shipments-bookings') {
        if (shipmentViewState === 'detail' && selectedShipment) {
            return (
                <ShipmentDetailView
                    shipment={selectedShipment}
                    onBack={handleBackToShipmentList}
                    isSubPanelOpen={isDetailSubPanelOpen}
                    toggleSubPanel={() => setIsDetailSubPanelOpen(!isDetailSubPanelOpen)}
                />
            );
        }
        return (
            <ShipmentListView
                onShipmentSelect={handleSelectShipment}
                isSubPanelOpen={isListSubPanelOpen}
                toggleSubPanel={() => setIsListSubPanelOpen(!isListSubPanelOpen)}
            />
        );
    }

    if (activeSubView === 'cargo-manifests') {
        if (packingListViewState === 'detail') {
            return <PackingListDetailView packingList={selectedPackingList} onBack={handleBackToPackingList} onSave={handleSavePackingList} />;
        }
        return <PackingListView packingLists={packingLists} onPackingListSelect={handleSelectPackingList} onNewPackingList={handleNewPackingList} />;
    }

    if (activeSubView === 'shipping-instructions') {
        if (siViewState === 'detail') {
            return <ShippingInstructionDetailView shippingInstruction={selectedSi} onBack={handleBackToSiList} onSave={handleSaveSi} />;
        }
        return <ShippingInstructionListView shippingInstructions={shippingInstructions} onSiSelect={handleSelectSi} onNewSi={handleNewSi} />;
    }

    // CARGO TRACKING RENDER
    if (activeSubView === 'cargo-tracking') {
        return (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Input search */}
                    <div className="bg-white p-6 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 flex items-center gap-2">
                            <Compass className="h-5 w-5 text-blue-500 animate-spin-slow" /> Real-time Global Cargo & Vessel Odyssey
                        </h2>
                        <form onSubmit={executeTrackSearch} className="mt-4 relative">
                            <input 
                                type="text"
                                className="block w-full rounded-md border border-gray-300 pl-4 pr-10 py-2.5 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                value={trackQuery}
                                onChange={e => setTrackQuery(e.target.value)}
                                placeholder="Enter container number (e.g. MSKU9048392, ONEY3029481)"
                            />
                            <button 
                                type="submit" 
                                className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-650"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    {/* Left feedback tracking logs */}
                    {matchedTrack ? (
                        <div className="bg-white p-6 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest font-mono">Ocean Transit Journey Milestones</h3>
                            </div>

                            {/* Beautiful flow milestone wizard */}
                            <div className="relative flex items-center justify-between">
                                <div className="absolute left-0 right-0 h-0.5 bg-gray-100 top-4 -z-10 dark:bg-gray-700"></div>
                                {['POL', 'Sailing', 'Transit', 'POD', 'Customs', 'Delivered'].map((m, idx) => {
                                    const milestones = ['POL', 'Sailing', 'Transit', 'POD', 'Customs', 'Delivered'];
                                    const currentIdx = milestones.indexOf(matchedTrack.currentMilestone);
                                    const active = idx <= currentIdx;
                                    const highlight = idx === currentIdx;
                                    return (
                                        <div key={m} className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                highlight ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/60' :
                                                active ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <span className={`mt-2 text-[10px] font-mono tracking-wider font-semibold ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                {m}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Detailed Activity Logs */}
                            <div className="pt-4 border-t dark:border-gray-700">
                                <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-gray-400 mb-4">Tracking History logs</h3>
                                <div className="relative pl-6 border-l border-gray-100 space-y-6 dark:border-gray-700">
                                    {matchedTrack.logs.map((log, loIdx) => (
                                        <div key={loIdx} className="relative">
                                            <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800"></div>
                                            <div className="text-xs font-mono text-gray-400">{log.time}</div>
                                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{log.activity}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-mono"><MapPin className="h-3.5 w-3.5 text-gray-450" /> {log.location}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 text-gray-400 font-mono">
                            <Ship className="h-10 w-10 mx-auto opacity-30 mb-4 animate-bounce" />
                            No matching container tracker file was active. Try searching for "MSKU9048392".
                        </div>
                    )}
                </div>

                {/* Tracking Right Side Vessel Specs */}
                {matchedTrack && (
                    <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-lg p-6 shadow space-y-6 self-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/10 rounded-lg">
                                <Ship className="h-6 w-6 text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="text-xs font-mono text-indigo-300 uppercase tracking-widest">Active Vessel Carrier</h3>
                                <p className="text-sm font-bold font-serif leading-tight">{matchedTrack.vessel}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono text-indigo-150">
                            <div className="flex justify-between">
                                <span>Carrier:</span> <strong className="text-white">{matchedTrack.carrier}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Voyage No:</span> <strong className="text-white">{matchedTrack.voyage}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>POL (Origin):</span> <strong className="text-white">{matchedTrack.origin}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>POD (Destination):</span> <strong className="text-white">{matchedTrack.destination}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Contract Code:</span> <strong className="text-white">CO-0428</strong>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded p-4 flex gap-3 items-center">
                            <Timer className="h-5 w-5 text-indigo-300 animate-pulse" />
                            <div>
                                <span className="text-[10px] text-indigo-200 uppercase tracking-wider block font-mono">Estimated Arrival (ETA / ETD)</span>
                                <span className="text-sm font-bold font-mono text-emerald-400">{matchedTrack.etaDate}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // DEMURRAGE & DETENTION RENDER
    if (activeSubView === 'demurrage-detention') {
        if (isCreatingDd || isEditingDd) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono mb-6">
                        {isCreatingDd ? 'Create Demurrage / Detention Limit Log' : 'Edit Demurrage Logs Parameters'}
                    </h2>
                    <form onSubmit={saveDdForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Container Number</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                    value={ddForm.containerNo || ''}
                                    onChange={e => setDdForm({...ddForm, containerNo: e.target.value.toUpperCase()})}
                                    placeholder="e.g. MSKU9820148"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Operational Booking Code</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                    value={ddForm.bookingNo || ''}
                                    onChange={e => setDdForm({...ddForm, bookingNo: e.target.value})}
                                    placeholder="e.g. BK-5012"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Shipping Line (Carrier)</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={ddForm.carrier || 'MAERSK LINE'}
                                    onChange={e => setDdForm({...ddForm, carrier: e.target.value})}
                                >
                                    <option value="MAERSK LINE">MAERSK LINE</option>
                                    <option value="OCEAN NETWORK EXPRESS">OCEAN NETWORK EXPRESS (ONE)</option>
                                    <option value="CMA CGM">CMA CGM</option>
                                    <option value="MSC">MSC</option>
                                    <option value="EVERGREEN">EVERGREEN</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Discharge / Terminal Gate-In Date</label>
                                <input 
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={ddForm.dischargeDate || ''}
                                    onChange={e => setDdForm({...ddForm, dischargeDate: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Contractual Free Days</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={ddForm.freeDays || 0}
                                    onChange={e => setDdForm({...ddForm, freeDays: Number(e.target.value)})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Elapsed / Current Days at Yard</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={ddForm.currentDays || 0}
                                    onChange={e => setDdForm({...ddForm, currentDays: Number(e.target.value)})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono font-mono">Daily Idle Penalty Rate (USD)</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={ddForm.dailyRateUsd || 0}
                                    onChange={e => setDdForm({...ddForm, dailyRateUsd: Number(e.target.value)})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono font-mono">Port of Storage</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={ddForm.port || ''}
                                    onChange={e => setDdForm({...ddForm, port: e.target.value})}
                                    placeholder="e.g. Port of Tanjung Priok (IDTPP)"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-700">
                            <button 
                                type="button"
                                onClick={() => { setIsCreatingDd(false); setIsEditingDd(false); }}
                                className="px-4 py-2 border rounded text-xs tracking-wider uppercase font-mono font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs tracking-wider uppercase font-mono font-medium"
                            >
                                Save Demurrage case
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold font-mono text-gray-900 dark:text-gray-50">DnD Fee Risk Tracker</h2>
                        <p className="text-xs text-gray-500">Monitor container free-time expiration parameters and minimize costly port penalty storage liabilities.</p>
                    </div>
                    <button 
                        onClick={openNewDdForm}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs tracking-wider uppercase font-mono font-medium shadow"
                    >
                        <Plus className="h-4 w-4" /> Add Container D&D Case
                    </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {demurrageCases.map(c => {
                        const elapsedOver = c.currentDays > c.freeDays;
                        const excessDays = elapsedOver ? c.currentDays - c.freeDays : 0;
                        const totalChargeUSD = excessDays * c.dailyRateUsd;

                        return (
                            <div 
                                key={c.id} 
                                className={`rounded-lg border p-5 bg-white shadow-sm dark:bg-gray-800 ${
                                    c.status === 'Overdue' ? 'border-red-200 dark:border-red-950/80 bg-red-50/5' :
                                    c.status === 'Warning' ? 'border-amber-200 dark:border-amber-950/80 bg-amber-50/5' :
                                    'border-gray-100 dark:border-gray-700'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold font-mono text-gray-400 bg-gray-50 dark:bg-gray-900/60 px-2 py-0.5 rounded">
                                        {c.carrier}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        c.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                        c.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                                        'bg-emerald-100 text-emerald-800'
                                    }`}>
                                        {c.status}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-gray-100 font-mono">
                                    {c.containerNo}
                                </h3>
                                <p className="text-xs text-gray-500 font-mono">Booking: {c.bookingNo}</p>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs font-mono">
                                    <div>
                                        <span className="text-gray-400 block">Free Days:</span>
                                        <strong className="text-gray-700 dark:text-white">{c.freeDays} Days</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block">Elapsed:</span>
                                        <strong className={elapsedOver ? 'text-red-650 font-bold' : 'text-gray-700 dark:text-white'}>{c.currentDays} Days</strong>
                                    </div>
                                </div>

                                {elapsedOver ? (
                                    <div className="mt-4 p-3 rounded bg-red-50 border border-red-100/60 flex justify-between items-center dark:bg-red-950/25 dark:border-red-900/50">
                                        <div>
                                            <span className="text-[10px] font-mono block text-red-500 uppercase tracking-widest font-semibold">Overdue Penalty</span>
                                            <span className="text-sm font-bold font-mono text-red-650 dark:text-red-400">${totalChargeUSD} USD</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-red-400 font-medium">+{excessDays} days over</span>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-3 rounded bg-emerald-50 border border-emerald-100/60 dark:bg-emerald-950/25 dark:border-emerald-900/50 text-xs text-center">
                                        <span className="text-emerald-700 dark:text-emerald-400 font-mono">No accrued penalty yet</span>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-2 justify-end border-t pt-3 dark:border-gray-700">
                                    <button 
                                        onClick={() => openEditDdForm(c)}
                                        className="text-xs text-indigo-600 hover:text-indigo-750 font-semibold flex items-center gap-1 dark:text-indigo-400"
                                    >
                                        <Edit2 className="h-3 w-3" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteDdCase(c.id)}
                                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                                    >
                                        <Trash2 className="h-3 w-3" /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // DEFAULT LOGISTICS HUB DASHBOARD FOR MODULE SEGMENT
    return <OperationsDashboard setActiveView={setActiveView} setActiveSubView={setActiveSubView} />;
};

export default LogisticsView;
