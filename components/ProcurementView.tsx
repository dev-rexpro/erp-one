import React, { useState, useEffect } from 'react';
import type { Breadcrumb } from '../types';
import { UserCheck, ShieldCheck, Mail, Phone, MapPin, Search, Plus, Trash2, Edit2, Coins, FileCheck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Partner {
    id: string;
    companyName: string;
    type: 'Trucking' | 'Shipping Line' | 'Customs Broker' | 'Deport Agency';
    contactPerson: string;
    email: string;
    phone: string;
    rating: number; // e.g. 4.8 / 5.0
    status: 'Active' | 'Under Review';
}

interface VendorRate {
    id: string;
    vendorName: string;
    origin: string;
    destination: string;
    containerType: '20GP' | '40HC' | '45HC' | 'LCL';
    oceanFreightUSD: number;
    surchargesIDR: number; // THC / LSS local fees
    validUntil: string;
}

interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorName: string;
    serviceDescription: string;
    totalAmountIDR: number;
    status: 'Draft' | 'Sent' | 'Approved' | 'Invoiced';
    issueDate: string;
}

interface ProcurementViewProps {
    activeSubView: string | null;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const ProcurementView: React.FC<ProcurementViewProps> = ({
    activeSubView,
    setActiveSubView,
    setBreadcrumbs
}) => {
    // -------------------------------------------------------------------------
    // Persistent lists state
    // -------------------------------------------------------------------------
    const [partners, setPartners] = useState<Partner[]>(() => {
        const cached = localStorage.getItem('PROCUREMENT_PARTNERS');
        return cached ? JSON.parse(cached) : [
            { id: 'PART-01', companyName: 'PT Samudera Logistik Nusantara', type: 'Trucking', contactPerson: 'Budi Santoso', email: 'budi@samudera.com', phone: '+62 811-902-832', rating: 4.8, status: 'Active' },
            { id: 'PART-02', companyName: 'MAERSK LINE INDONESIA', type: 'Shipping Line', contactPerson: 'Juliet Tan', email: 'juliet.tan@maersk.com', phone: '+62 21-3004-900', rating: 4.9, status: 'Active' },
            { id: 'PART-03', companyName: 'CV Jasa Bea Kepabeanan Utama', type: 'Customs Broker', contactPerson: 'Hendra Setiawan', email: 'hendra.s@jasabea.co.id', phone: '+62 812-4029-384', rating: 4.5, status: 'Active' },
            { id: 'PART-04', companyName: 'PT Depo Kontainer Maritim', type: 'Deport Agency', contactPerson: 'Amiruddin', email: 'amiruddin@depokontainer.id', phone: '+62 815-992-019', rating: 4.2, status: 'Under Review' },
        ];
    });

    const [vendorRates, setVendorRates] = useState<VendorRate[]>(() => {
        const cached = localStorage.getItem('PROCUREMENT_RATES');
        return cached ? JSON.parse(cached) : [
            { id: 'RATE-101', vendorName: 'MAERSK LINE', origin: 'Jakarta (IDTPP)', destination: 'Singapore (SGSIN)', containerType: '20GP', oceanFreightUSD: 350, surchargesIDR: 1200000, validUntil: '2026-06-30' },
            { id: 'RATE-102', vendorName: 'SAMUDERA SHIPPING', origin: 'Jakarta (IDTPP)', destination: 'Port Klang (MYPKG)', containerType: '40HC', oceanFreightUSD: 520, surchargesIDR: 1500000, validUntil: '2026-06-15' },
            { id: 'RATE-103', vendorName: 'MSC CARRIER', origin: 'Surabaya (IDSUB)', destination: 'Shanghai (CNSHA)', containerType: '40HC', oceanFreightUSD: 1450, surchargesIDR: 1800000, validUntil: '2026-07-10' },
            { id: 'RATE-104', vendorName: 'PT Samudera Logistik Nusantara', origin: 'Tanjung Priok Yard', destination: 'Cikarang Dry Port', containerType: '20GP', oceanFreightUSD: 0, surchargesIDR: 2800000, validUntil: '2026-12-31' },
        ];
    });

    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
        const cached = localStorage.getItem('PROCUREMENT_POS');
        return cached ? JSON.parse(cached) : [
            { id: 'PO-001', poNumber: 'PO-26-00481', vendorName: 'PT Samudera Logistik Nusantara', serviceDescription: 'Haulage transportation for 5x40HC Containers Tanjung Priok to Cikarang', totalAmountIDR: 14000000, status: 'Invoiced', issueDate: '2026-06-01' },
            { id: 'PO-002', poNumber: 'PO-26-00482', vendorName: 'CV Jasa Bea Kepabeanan Utama', serviceDescription: 'Customs clearance brokerage fees for PIB declaration coffee shipments', totalAmountIDR: 2500000, status: 'Approved', issueDate: '2026-06-03' },
            { id: 'PO-003', poNumber: 'PO-26-00483', vendorName: 'PT Depo Kontainer Maritim', serviceDescription: 'Container washing and pre-trip inspection services (PTI)', totalAmountIDR: 1250000, status: 'Sent', issueDate: '2026-06-04' },
            { id: 'PO-004', poNumber: 'PO-26-00484', vendorName: 'MAERSK LINE INDONESIA', serviceDescription: 'Ocean freight freightage charge 20GP Green Tea to SGSIN', totalAmountIDR: 5705000, status: 'Draft', issueDate: '2026-06-05' },
        ];
    });

    // Sync to Storage
    useEffect(() => {
        localStorage.setItem('PROCUREMENT_PARTNERS', JSON.stringify(partners));
    }, [partners]);

    useEffect(() => {
        localStorage.setItem('PROCUREMENT_RATES', JSON.stringify(vendorRates));
    }, [vendorRates]);

    useEffect(() => {
        localStorage.setItem('PROCUREMENT_POS', JSON.stringify(purchaseOrders));
    }, [purchaseOrders]);

    // -------------------------------------------------------------------------
    // Sub-view flow states
    // -------------------------------------------------------------------------
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isEditingPartner, setIsEditingPartner] = useState(false);
    const [isCreatingPartner, setIsCreatingPartner] = useState(false);

    const [selectedRate, setSelectedRate] = useState<VendorRate | null>(null);
    const [isEditingRate, setIsEditingRate] = useState(false);
    const [isCreatingRate, setIsCreatingRate] = useState(false);

    const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);
    const [isEditingPo, setIsEditingPo] = useState(false);
    const [isCreatingPo, setIsCreatingPo] = useState(false);

    // Form states
    const [partnerForm, setPartnerForm] = useState<Partial<Partner>>({});
    const [rateForm, setRateForm] = useState<Partial<VendorRate>>({});
    const [poForm, setPoForm] = useState<Partial<PurchaseOrder>>({});

    const [partnerSearch, setPartnerSearch] = useState('');

    // Breadcrumbs Logic
    useEffect(() => {
        const base: Breadcrumb = { label: 'Procurement', onClick: () => setActiveSubView('dashboard') };
        if (activeSubView === 'partner-directory') {
            if (isCreatingPartner) {
                setBreadcrumbs([base, { label: 'Partner Directory', onClick: () => { setIsCreatingPartner(false); setIsEditingPartner(false); } }, { label: 'New Partner' }]);
            } else {
                setBreadcrumbs([base, { label: 'Partner Directory' }]);
            }
        } else if (activeSubView === 'vendor-rates') {
            if (isCreatingRate) {
                setBreadcrumbs([base, { label: 'Vendor Rates', onClick: () => { setIsCreatingRate(false); setIsEditingRate(false); } }, { label: 'New Rate Row' }]);
            } else {
                setBreadcrumbs([base, { label: 'Vendor Rates' }]);
            }
        } else if (activeSubView === 'purchase-orders') {
            if (isCreatingPo) {
                setBreadcrumbs([base, { label: 'Purchase Orders', onClick: () => { setIsCreatingPo(false); setIsEditingPo(false); } }, { label: 'New PO Document' }]);
            } else {
                setBreadcrumbs([base, { label: 'Purchase Orders' }]);
            }
        } else {
            setBreadcrumbs([{ label: 'Procurement' }]);
        }
    }, [activeSubView, isCreatingPartner, isCreatingRate, isCreatingPo, setBreadcrumbs]);

    // -------------------------------------------------------------------------
    // Form submission handlers
    // -------------------------------------------------------------------------
    
    // Partner Management
    const openNewPartnerForm = () => {
        setPartnerForm({
            id: 'PART-' + Math.floor(Math.random() * 100),
            companyName: '',
            type: 'Trucking',
            contactPerson: '',
            email: '',
            phone: '',
            rating: 5.0,
            status: 'Active'
        });
        setIsCreatingPartner(true);
        setIsEditingPartner(false);
    };

    const openEditPartnerForm = (p: Partner) => {
        setSelectedPartner(p);
        setPartnerForm({ ...p });
        setIsEditingPartner(true);
        setIsCreatingPartner(false);
    };

    const savePartnerForm = (e: React.FormEvent) => {
        e.preventDefault();
        const saved = partnerForm as Partner;
        setPartners(prev => {
            const exists = prev.some(item => item.id === saved.id);
            if (exists) {
                return prev.map(item => item.id === saved.id ? saved : item);
            } else {
                return [saved, ...prev];
            }
        });
        setIsCreatingPartner(false);
        setIsEditingPartner(false);
        setSelectedPartner(null);
    };

    const deletePartner = (id: string) => {
        if (confirm('Delete this partner profile?')) {
            setPartners(prev => prev.filter(p => p.id !== id));
        }
    };

    // Vendor Rates
    const openNewRateForm = () => {
        setRateForm({
            id: 'RATE-' + Math.floor(Math.random() * 1000),
            vendorName: '',
            origin: '',
            destination: '',
            containerType: '20GP',
            oceanFreightUSD: 0,
            surchargesIDR: 0,
            validUntil: new Date().toISOString().split('T')[0]
        });
        setIsCreatingRate(true);
        setIsEditingRate(false);
    };

    const openEditRateForm = (r: VendorRate) => {
        setSelectedRate(r);
        setRateForm({ ...r });
        setIsEditingRate(true);
        setIsCreatingRate(false);
    };

    const saveRateForm = (e: React.FormEvent) => {
        e.preventDefault();
        const saved = rateForm as VendorRate;
        setVendorRates(prev => {
            const exists = prev.some(item => item.id === saved.id);
            if (exists) {
                return prev.map(item => item.id === saved.id ? saved : item);
            } else {
                return [saved, ...prev];
            }
        });
        setIsCreatingRate(false);
        setIsEditingRate(false);
        setSelectedRate(null);
    };

    const deleteRate = (id: string) => {
        if (confirm('Delete this vendor rate item Row?')) {
            setVendorRates(prev => prev.filter(r => r.id !== id));
        }
    };

    // Purchase Orders
    const openNewPoForm = () => {
        const lastNo = purchaseOrders.length > 0 ? Number(purchaseOrders[0].poNumber.split('-').pop()) : 480;
        setPoForm({
            id: 'PO-' + Math.floor(Math.random() * 1000),
            poNumber: `PO-26-${lastNo + 1}`,
            vendorName: '',
            serviceDescription: '',
            totalAmountIDR: 0,
            status: 'Draft',
            issueDate: new Date().toISOString().split('T')[0]
        });
        setIsCreatingPo(true);
        setIsEditingPo(false);
    };

    const openEditPoForm = (po: PurchaseOrder) => {
        setSelectedPo(po);
        setPoForm({ ...po });
        setIsEditingPo(true);
        setIsCreatingPo(false);
    };

    const savePoForm = (e: React.FormEvent) => {
        e.preventDefault();
        const saved = poForm as PurchaseOrder;
        setPurchaseOrders(prev => {
            const exists = prev.some(item => item.id === saved.id);
            if (exists) {
                return prev.map(item => item.id === saved.id ? saved : item);
            } else {
                return [saved, ...prev];
            }
        });
        setIsCreatingPo(false);
        setIsEditingPo(false);
        setSelectedPo(null);
    };

    const deletePo = (id: string) => {
        if (confirm('Delete this Purchase Order draft?')) {
            setPurchaseOrders(prev => prev.filter(po => po.id !== id));
        }
    };

    // Filter partners directory
    const filteredPartners = partners.filter(p => 
        p.companyName.toLowerCase().includes(partnerSearch.toLowerCase()) || 
        p.contactPerson.toLowerCase().includes(partnerSearch.toLowerCase())
    );

    // -------------------------------------------------------------------------
    // Views Render
    // -------------------------------------------------------------------------
    
    // PARTNER DIRECTORY VIEW
    if (activeSubView === 'partner-directory') {
        if (isCreatingPartner || isEditingPartner) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 font-sans">
                    <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 mb-6">
                        {isCreatingPartner ? 'Register New Procurement Vendor / Shipping Partner' : 'Edit Partner Profile'}
                    </h2>
                    <form onSubmit={savePartnerForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Company Legal Name</label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    value={partnerForm.companyName || ''}
                                    onChange={e => setPartnerForm({...partnerForm, companyName: e.target.value})}
                                    placeholder="e.g. PT Samudera Logistik Nusantara"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Operations Segment type</label>
                                <Select value={partnerForm.type || 'Trucking'} onValueChange={val => setPartnerForm({...partnerForm, type: val as any})}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder="Select operations segment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Trucking">Trucking & Land Haulage</SelectItem>
                                        <SelectItem value="Shipping Line">Shipping Ocean Carrier Line</SelectItem>
                                        <SelectItem value="Customs Broker">Customs Clearance Broker (PPJK)</SelectItem>
                                        <SelectItem value="Deport Agency">Depot Yard & Storage Agency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Key Contact Person</label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    value={partnerForm.contactPerson || ''}
                                    onChange={e => setPartnerForm({...partnerForm, contactPerson: e.target.value})}
                                    placeholder="e.g. Hendra Santoso"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Contact Email</label>
                                <Input
                                    type="email"
                                    className="mt-1"
                                    value={partnerForm.email || ''}
                                    onChange={e => setPartnerForm({...partnerForm, email: e.target.value})}
                                    placeholder="e.g. contact@samudera.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Phone Number</label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    value={partnerForm.phone || ''}
                                    onChange={e => setPartnerForm({...partnerForm, phone: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Partner KPI Rating Score (0.0 - 5.0)</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    className="mt-1"
                                    value={partnerForm.rating || 5.0}
                                    onChange={e => setPartnerForm({...partnerForm, rating: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-700">
                            <Button type="button" variant="outline" onClick={() => { setIsCreatingPartner(false); setIsEditingPartner(false); }} className="px-4 py-2 text-xs uppercase">Cancel</Button>
                            <Button type="submit" className="px-4 py-2 text-xs uppercase">Save Partner Entry</Button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="relative max-w-sm w-full">
                        <Input
                            type="text"
                            placeholder="Search partners directory..."
                            className="w-full pl-9 pr-3 py-2"
                            value={partnerSearch}
                            onChange={e => setPartnerSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <Button onClick={openNewPartnerForm} className="inline-flex items-center gap-1.5 px-3 py-2">
                        <Plus className="h-4 w-4" /> Add Logistics Vendor
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {filteredPartners.map(p => (
                        <div key={p.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-bold font-mono text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 px-2 py-0.5 rounded">
                                            {p.type}
                                        </span>
                                        <h3 className="mt-2 text-base font-bold font-serif text-gray-900 dark:text-gray-55">{p.companyName}</h3>
                                    </div>
                                    <span className="text-xs font-mono font-semibold text-amber-500 flex items-center gap-1">
                                        ★ {p.rating}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2 text-xs font-mono text-gray-600 dark:text-gray-450 border-t pt-3 dark:border-gray-700">
                                    <div className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-gray-400" /> <span className="font-sans text-gray-700 dark:text-gray-305">{p.contactPerson}</span></div>
                                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {p.email}</div>
                                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> {p.phone}</div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <Button variant="ghost" size="sm" onClick={() => openEditPartnerForm(p)} className="flex items-center gap-1">
                                    <Edit2 className="h-3.5 w-3.5" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deletePartner(p.id)} className="flex items-center gap-1 text-red-600">
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // VENDOR CONTRACT RATES VIEW
    if (activeSubView === 'vendor-rates') {
        if (isCreatingRate || isEditingRate) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 mb-6">- Log Procurement Bought Rates -</h2>
                    <form onSubmit={saveRateForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Shipping Line / Carrier Name</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={rateForm.vendorName || ''}
                                    onChange={e => setRateForm({...rateForm, vendorName: e.target.value})}
                                    placeholder="e.g. MAERSK LINE"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Port of Loading (Origin)</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={rateForm.origin || ''}
                                    onChange={e => setRateForm({...rateForm, origin: e.target.value})}
                                    placeholder="e.g. Jakarta (IDTPP)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Port of Discharge (Destination)</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={rateForm.destination || ''}
                                    onChange={e => setRateForm({...rateForm, destination: e.target.value})}
                                    placeholder="e.g. Singapore (SGSIN)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Equipment / Container Type</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={rateForm.containerType || '20GP'}
                                    onChange={e => setRateForm({...rateForm, containerType: e.target.value as any})}
                                    required
                                >
                                    <option value="20GP">20' Dry Standard (20GP)</option>
                                    <option value="40HC">40' High Cube (40HC)</option>
                                    <option value="45HC">45' High Cube (45HC)</option>
                                    <option value="LCL">Less than Container Load (LCL CBM)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-750 dark:text-gray-300 uppercase tracking-widest font-mono">Ocean Freight Bought Price (USD)</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                    value={rateForm.oceanFreightUSD || 0}
                                    onChange={e => setRateForm({...rateForm, oceanFreightUSD: Number(e.target.value)})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Local THC / Surcharges (IDR)</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                    value={rateForm.surchargesIDR || 0}
                                    onChange={e => setRateForm({...rateForm, surchargesIDR: Number(e.target.value)})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Price Validity date limit</label>
                                <input 
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={rateForm.validUntil || ''}
                                    onChange={e => setRateForm({...rateForm, validUntil: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-700">
                            <button 
                                type="button"
                                onClick={() => { setIsCreatingRate(false); setIsEditingRate(false); }}
                                className="px-4 py-2 border rounded text-xs tracking-wider uppercase font-mono font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-gray-900 text-white rounded text-xs tracking-wider uppercase font-mono font-medium"
                            >
                                Save Contract Rate
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 flex items-center gap-1.5"><Coins className="h-5 w-5 text-indigo-505" /> Vendor Bought Rates Sheets</h2>
                        <p className="text-xs text-gray-505">Freight buy-rates negotiated with ocean lines and local haulers partners.</p>
                    </div>
                    <Button onClick={openNewRateForm} className="inline-flex items-center gap-1.5 px-3 py-2">
                        <Plus className="h-4 w-4" /> Add rate record
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Vendor</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Route Path (POL &rarr; POD)</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Equip Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Freight Buy (USD)</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Local THC (IDR)</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Valid Until</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-700">
                                {vendorRates.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-705">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100 font-serif">
                                            {r.vendorName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600 dark:text-gray-300">
                                            {r.origin} &rarr; {r.destination}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 dark:bg-gray-700">
                                                {r.containerType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                            ${r.oceanFreightUSD.toLocaleString()} USD
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600 dark:text-gray-400">
                                            Rp {r.surchargesIDR.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                                            {r.validUntil}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-mono font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditRateForm(r)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteRate(r.id)} className="text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // PURCHASE ORDERS VIEW RENDER
    if (activeSubView === 'purchase-orders') {
        if (isCreatingPo || isEditingPo) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 mb-6">
                        {isCreatingPo ? 'Issue New Purchase Order Document' : 'Edit PO Draft'}
                    </h2>
                    <form onSubmit={savePoForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">PO Registry Code</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono text-gray-900 font-bold"
                                    value={poForm.poNumber || ''}
                                    readOnly={isEditingPo}
                                    onChange={e => setPoForm({...poForm, poNumber: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Target Logistics Partner</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={poForm.vendorName || ''}
                                    onChange={e => setPoForm({...poForm, vendorName: e.target.value})}
                                    required
                                >
                                    <option value="">Select partner...</option>
                                    {partners.map(p => (
                                        <option key={p.id} value={p.companyName}>{p.companyName} ({p.type})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Detailed job description of operational costs</label>
                                <textarea 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={poForm.serviceDescription || ''}
                                    onChange={e => setPoForm({...poForm, serviceDescription: e.target.value})}
                                    rows={3}
                                    placeholder="Haulage contracts parameters..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Estimated Order value (IDR)</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                    value={poForm.totalAmountIDR || 0}
                                    onChange={e => setPoForm({...poForm, totalAmountIDR: Number(e.target.value)})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Operational Dispatch Status</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={poForm.status || 'Draft'}
                                    onChange={e => setPoForm({...poForm, status: e.target.value as any})}
                                >
                                    <option value="Draft">Draft (Internal preparation)</option>
                                    <option value="Sent">Sent (Awaiting vendor invoice)</option>
                                    <option value="Approved">Approved (Finalised cost)</option>
                                    <option value="Invoiced">Invoiced (Under Accounts Payable)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-700">
                            <button 
                                type="button"
                                onClick={() => { setIsCreatingPo(false); setIsEditingPo(false); }}
                                className="px-4 py-2 border rounded text-xs tracking-wider uppercase font-mono font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-gray-900 text-white rounded text-xs tracking-wider uppercase font-mono font-medium"
                            >
                                Dispatch Purchase Order
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-6 flex-col">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 flex items-center gap-1.5"><FileCheck className="h-5 w-5 text-indigo-400" /> Procurement Jobs Purchase Orders (PO)</h2>
                        <p className="text-xs text-gray-500">Track outward commitments issued to local brokers, depots, and carriers.</p>
                    </div>
                    <Button onClick={openNewPoForm} className="inline-flex items-center gap-1.5 px-3 py-2">
                        <Plus className="h-4 w-4" /> Issue PO Document
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {purchaseOrders.map(po => {
                        const paid = po.status === 'Invoiced' || po.status === 'Approved';
                        return (
                            <div key={po.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-mono font-bold text-gray-900 dark:text-indigo-400">
                                                {po.poNumber}
                                            </span>
                                            <h3 className="mt-1 text-sm font-bold font-serif text-gray-800 dark:text-gray-100 leading-tight">
                                                {po.vendorName}
                                            </h3>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            paid ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                            {po.status === 'Invoiced' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                            {po.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                                        {po.serviceDescription}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center whitespace-nowrap">
                                    <div>
                                        <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-widest">Order value</span>
                                        <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                                            Rp {po.totalAmountIDR.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditPoForm(po)} className="flex items-center gap-1">
                                            <Edit2 className="h-3.5 w-3.5" /> Edit
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => deletePo(po.id)} className="flex items-center gap-1 text-red-600">
                                            <Trash2 className="h-3.5 w-3.5" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // GENERAL BLUEPRINT FOR CENTRALIZED VIEW DASHBOARD
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-mono">Central Procurement & Carrier Rates Hub</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Maintain precise control of logistics carriers directories, contracts ocean bought-rates parameters, and output operational Purchase Orders cleanly.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <button 
                    onClick={() => setActiveSubView('partner-directory')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <UserCheck className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono font-mono">Partner Directory</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Keep track of active trucking agencies, co-broker associations, customs lines agents, and carrier directories on file.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100">
                        Open Directory &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('vendor-rates')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <Coins className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Vendor Rates</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Store negotiated rates parameters contracts on routes like Jakarta, Surabaya, Shanghai or Port Klang ocean corridors.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100">
                        Open Rates Sheets &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('purchase-orders')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <FileCheck className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Purchase Orders</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Log outward financial PO commitments issued directly to operational job operators with real-status clearances.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100">
                        Open PO Registry &rarr;
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ProcurementView;
