import React, { useState, useEffect } from 'react';
import type { Breadcrumb } from '../types';
import { Landmark, ShieldCheck, Calculator, Plus, Printer, Edit2, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CustomsDoc {
    id: string;
    type: 'PIB' | 'PEB';
    docNo: string;
    client: string;
    submitDate: string;
    status: 'Draft' | 'Sent' | 'Jalur Hijau' | 'Jalur Kuning' | 'Jalur Merah';
    hsCode: string;
    goodsDescription: string;
    invoiceValueUSD: number;
    dutyAmountIDR: number;
}

interface TradeLicense {
    id: string;
    name: string;
    licenseNumber: string;
    issuedBy: string;
    issueDate: string;
    expiryDate: string;
    status: 'Active' | 'Warning' | 'Expired';
    documentType: string;
}

interface HSTariff {
    hsCode: string;
    description: string;
    importDuty: number; // percentage
    ppn: number; // percentage
    pph: number; // percentage
    lartas: boolean; // restricted or not
    restrictedReq?: string;
}

interface ComplianceViewProps {
    activeSubView: string | null;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const ComplianceView: React.FC<ComplianceViewProps> = ({
    activeSubView,
    setActiveSubView,
    setBreadcrumbs
}) => {
    // -------------------------------------------------------------------------
    // Initial States / Local Storage Cache
    // -------------------------------------------------------------------------
    const [customsDocs, setCustomsDocs] = useState<CustomsDoc[]>(() => {
        const cached = localStorage.getItem('COMPLIANCE_CUSTOMS');
        return cached ? JSON.parse(cached) : [
            { id: 'CUST-101', type: 'PEB', docNo: '001290-06-2026', client: 'PT Nusantara Jaya', submitDate: '2026-06-01', status: 'Jalur Hijau', hsCode: '0901.11.10', goodsDescription: 'Arabica Coffee Beans Grade A', invoiceValueUSD: 45000, dutyAmountIDR: 0 },
            { id: 'CUST-102', type: 'PIB', docNo: '304928-06-2026', client: 'PT Multi Elektronindo', submitDate: '2026-06-03', status: 'Jalur Kuning', hsCode: '8471.30.10', goodsDescription: 'Laptop spare parts & LED panels', invoiceValueUSD: 120000, dutyAmountIDR: 180000000 },
            { id: 'CUST-103', type: 'PIB', docNo: '100293-06-2026', client: 'CV Tekstil Mandiri', submitDate: '2026-06-04', status: 'Jalur Merah', hsCode: '6204.42.00', goodsDescription: 'Cotton Dresses Woven', invoiceValueUSD: 15400, dutyAmountIDR: 42000000 },
            { id: 'CUST-104', type: 'PEB', docNo: '001300-06-2026', client: 'PT Indo Agro Lestari', submitDate: '2026-06-05', status: 'Draft', hsCode: '1511.90.20', goodsDescription: 'Refined Palm Oil', invoiceValueUSD: 89000, dutyAmountIDR: 12500000 },
        ];
    });

    const [licenses, setLicenses] = useState<TradeLicense[]>(() => {
        const cached = localStorage.getItem('COMPLIANCE_LICENSES');
        return cached ? JSON.parse(cached) : [
            { id: 'LIC-01', name: 'Nomor Induk Berusaha (NIB)', licenseNumber: '9120008392019', issuedBy: 'OSS Lembaga Pengelola', issueDate: '2020-10-12', expiryDate: 'Lifetime', status: 'Active', documentType: 'Corporate' },
            { id: 'LIC-02', name: 'Angka Pengenal Importir (API-U)', licenseNumber: '02049381-H', issuedBy: 'Kementerian Perdagangan', issueDate: '2021-05-20', expiryDate: '2026-05-20', status: 'Expired', documentType: 'Import License' },
            { id: 'LIC-03', name: 'Persetujuan Ekspor CPO (PE)', licenseNumber: '03.PE-24.1293', issuedBy: 'Dirjen Perdagangan Luar Negeri', issueDate: '2026-01-10', expiryDate: '2026-07-10', status: 'Warning', documentType: 'Export Permit' },
            { id: 'LIC-04', name: 'Registrasi Kepabeanan Ekspor-Impor', licenseNumber: 'SINK-9820-DBea', issuedBy: 'Direktorat Jenderal Bea Cukai', issueDate: '2022-02-15', expiryDate: 'Lifetime', status: 'Active', documentType: 'Customs ID' },
        ];
    });

    // HS Tarif Registry for Indonesian INSW query simulator
    const hsDatabase: HSTariff[] = [
        { hsCode: '0901.11.10', description: 'Arabica Green Coffee Beans, Not Roasted Organic', importDuty: 5, ppn: 11, pph: 2.5, lartas: false },
        { hsCode: '8471.30.10', description: 'Laptops and portable digital processing machines, weight < 10kg', importDuty: 0, ppn: 11, pph: 2.5, lartas: true, restrictedReq: 'Persetujuan Impor (PI) Alat Elektronika dari Kemendag' },
        { hsCode: '6204.42.00', description: 'Women\'s dresses of cotton, knitted or woven clothing garments', importDuty: 15, ppn: 11, pph: 7.5, lartas: true, restrictedReq: 'Persetujuan Impor Tekstil & Laporan Surveyor (Kemenperin/Kemendag)' },
        { hsCode: '1507.10.00', description: 'Crude soya-bean oil, whether or not degummed', importDuty: 5, ppn: 11, pph: 2.5, lartas: false },
        { hsCode: '8517.13.00', description: 'Smartphones / Mobile cellular phones with radio receiver transceiver', importDuty: 0, ppn: 11, pph: 10, lartas: true, restrictedReq: 'Sertifikat SDPPI (Postel) & Tanda Pendaftaran Tipe (TPT) IMEI Kemendag' },
        { hsCode: '3004.90.99', description: 'Medicaments consisting of mixed or unmixed products for therapeutic uses', importDuty: 5, ppn: 11, pph: 2.5, lartas: true, restrictedReq: 'Izin Edar Badan Pengawas Obat dan Makanan (BPOM) RI' }
    ];

    // Local Storage synch
    useEffect(() => {
        localStorage.setItem('COMPLIANCE_CUSTOMS', JSON.stringify(customsDocs));
    }, [customsDocs]);

    useEffect(() => {
        localStorage.setItem('COMPLIANCE_LICENSES', JSON.stringify(licenses));
    }, [licenses]);

    // -------------------------------------------------------------------------
    // Sub-view flow states
    // -------------------------------------------------------------------------
    const [selectedDoc, setSelectedDoc] = useState<CustomsDoc | null>(null);
    const [isEditingDoc, setIsEditingDoc] = useState(false);
    const [isCreatingDoc, setIsCreatingDoc] = useState(false);

    const [selectedLicense, setSelectedLicense] = useState<TradeLicense | null>(null);
    const [isEditingLicense, setIsEditingLicense] = useState(false);
    const [isCreatingLicense, setIsCreatingLicense] = useState(false);

    // HS Codes lookup state
    const [searchTerm, setSearchTerm] = useState('');
    const [customValUSD, setCustomValUSD] = useState<number>(10000);
    const [calculatedTaxDetails, setCalculatedTaxDetails] = useState<any>(null);
    const [matchedTariff, setMatchedTariff] = useState<HSTariff | null>(null);

    // Form inputs states
    const [docForm, setDocForm] = useState<Partial<CustomsDoc>>({});
    const [licForm, setLicForm] = useState<Partial<TradeLicense>>({});

    // -------------------------------------------------------------------------
    // Breadcrumbs Logic
    // -------------------------------------------------------------------------
    useEffect(() => {
        const base: Breadcrumb = { label: 'Compliance', onClick: () => setActiveSubView('dashboard') };
        if (activeSubView === 'customs-declarations') {
            if (isCreatingDoc) {
                setBreadcrumbs([base, { label: 'Customs Declarations', onClick: () => { setIsCreatingDoc(false); setIsEditingDoc(false); } }, { label: 'New Declaration' }]);
            } else if (isEditingDoc && selectedDoc) {
                setBreadcrumbs([base, { label: 'Customs Declarations', onClick: () => { setIsCreatingDoc(false); setIsEditingDoc(false); } }, { label: `Edit ${selectedDoc.docNo}` }]);
            } else {
                setBreadcrumbs([base, { label: 'Customs Declarations' }]);
            }
        } else if (activeSubView === 'trade-licenses') {
            if (isCreatingLicense) {
                setBreadcrumbs([base, { label: 'Trade Licenses', onClick: () => { setIsCreatingLicense(false); setIsEditingLicense(false); } }, { label: 'New License' }]);
            } else if (isEditingLicense && selectedLicense) {
                setBreadcrumbs([base, { label: 'Trade Licenses', onClick: () => { setIsCreatingLicense(false); setIsEditingLicense(false); } }, { label: `Edit Licenses` }]);
            } else {
                setBreadcrumbs([base, { label: 'Trade Licenses' }]);
            }
        } else if (activeSubView === 'duty-tariffs') {
            setBreadcrumbs([base, { label: 'Duty Tariffs' }]);
        } else {
            setBreadcrumbs([{ label: 'Compliance' }]);
        }
    }, [activeSubView, isCreatingDoc, isEditingDoc, selectedDoc, isCreatingLicense, isEditingLicense, selectedLicense, setBreadcrumbs]);

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------
    
    // Customs Declaration handlers
    const openNewDocForm = () => {
        setDocForm({
            id: 'CUST-' + Math.floor(Math.random() * 1000),
            type: 'PEB',
            docNo: `${Math.floor(Math.random() * 900000 + 100000)}-06-2026`,
            client: '',
            submitDate: new Date().toISOString().split('T')[0],
            status: 'Draft',
            hsCode: '0901.11.10',
            goodsDescription: '',
            invoiceValueUSD: 0,
            dutyAmountIDR: 0
        });
        setIsCreatingDoc(true);
        setIsEditingDoc(false);
    };

    const openEditDocForm = (doc: CustomsDoc) => {
        setSelectedDoc(doc);
        setDocForm({ ...doc });
        setIsEditingDoc(true);
        setIsCreatingDoc(false);
    };

    const saveDocForm = (e: React.FormEvent) => {
        e.preventDefault();
        const saved = docForm as CustomsDoc;
        setCustomsDocs(prev => {
            const index = prev.findIndex(item => item.id === saved.id);
            if (index > -1) {
                return prev.map(item => item.id === saved.id ? saved : item);
            } else {
                return [saved, ...prev];
            }
        });
        setIsCreatingDoc(false);
        setIsEditingDoc(false);
        setSelectedDoc(null);
    };

    const deleteDoc = (id: string) => {
        if (confirm('Delete this declaration? This cannot be undone.')) {
            setCustomsDocs(prev => prev.filter(d => d.id !== id));
        }
    };

    // Licenses Form Handlers
    const openNewLicForm = () => {
        setLicForm({
            id: 'LIC-' + Math.floor(Math.random() * 100),
            name: '',
            licenseNumber: '',
            issuedBy: '',
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: '',
            status: 'Active',
            documentType: 'Corporate'
        });
        setIsCreatingLicense(true);
        setIsEditingLicense(false);
    };

    const openEditLicForm = (lic: TradeLicense) => {
        setSelectedLicense(lic);
        setLicForm({ ...lic });
        setIsEditingLicense(true);
        setIsCreatingLicense(false);
    };

    const saveLicForm = (e: React.FormEvent) => {
        e.preventDefault();
        const saved = licForm as TradeLicense;
        setLicenses(prev => {
            const index = prev.findIndex(item => item.id === saved.id);
            if (index > -1) {
                return prev.map(item => item.id === saved.id ? saved : item);
            } else {
                return [saved, ...prev];
            }
        });
        setIsCreatingLicense(false);
        setIsEditingLicense(false);
        setSelectedLicense(null);
    };

    const deleteLicense = (id: string) => {
        if (confirm('Are you sure you want to delete this license?')) {
            setLicenses(prev => prev.filter(l => l.id !== id));
        }
    };

    // INSW calculator routine
    const queryTariffAndCalculate = (code: string) => {
        const found = hsDatabase.find(h => h.hsCode === code) || 
                      hsDatabase.find(h => h.hsCode.startsWith(code.substring(0, 4))) ||
                      null;
        setMatchedTariff(found);

        if (found) {
            const exchangeRate = 16300; // Rupiah rate
            const cifValueIDR = customValUSD * exchangeRate;
            const importDutyValue = cifValueIDR * (found.importDuty / 100);
            const valueForPPN = cifValueIDR + importDutyValue;
            const ppnValue = valueForPPN * (found.ppn / 100);
            const pphValue = valueForPPN * (found.pph / 100);
            const totalTax = importDutyValue + ppnValue + pphValue;

            setCalculatedTaxDetails({
                exchangeRate,
                cifValueIDR,
                importDutyValue,
                ppnValue,
                pphValue,
                totalTax
            });
        } else {
            setCalculatedTaxDetails(null);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            queryTariffAndCalculate(searchTerm);
        } else {
            setMatchedTariff(null);
            setCalculatedTaxDetails(null);
        }
    }, [searchTerm, customValUSD]);

    const selectHSTariff = (hs: HSTariff) => {
        setSearchTerm(hs.hsCode);
    };

    // -------------------------------------------------------------------------
    // JSX Renders
    // -------------------------------------------------------------------------
    
    // CUSTOMS DECLARATIONS RENDER
    if (activeSubView === 'customs-declarations') {
        if (isCreatingDoc || isEditingDoc) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono mb-6">
                        {isCreatingDoc ? 'New Customs Declaration (NIB / SPI / PIB / PEB)' : `Edit Declaration Document [${selectedDoc?.id}]`}
                    </h2>
                    <form onSubmit={saveDocForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Document Type</label>
                                <Select value={docForm.type || 'PEB'} onValueChange={val => setDocForm({...docForm, type: val as 'PIB' | 'PEB'})}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PEB">Pemberitahuan Ekspor Barang (PEB)</SelectItem>
                                        <SelectItem value="PIB">Pemberitahuan Impor Barang (PIB)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Registry Serial No / Aju No</label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    value={docForm.docNo || ''}
                                    onChange={e => setDocForm({...docForm, docNo: e.target.value})}
                                    placeholder="e.g. 001290-06-2026"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Client Account Profile</label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    value={docForm.client || ''}
                                    onChange={e => setDocForm({...docForm, client: e.target.value})}
                                    placeholder="e.g. PT Nusantara Jaya"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Submission / Draft Date</label>
                                <Input
                                    type="date"
                                    className="mt-1"
                                    value={docForm.submitDate || ''}
                                    onChange={e => setDocForm({...docForm, submitDate: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Goods Classification HS Code</label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    value={docForm.hsCode || ''}
                                    onChange={e => setDocForm({...docForm, hsCode: e.target.value})}
                                    placeholder="e.g. 0901.11.10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Cargo Invoice Value (FOB/CIF USD)</label>
                                <Input
                                    type="number"
                                    className="mt-1"
                                    value={docForm.invoiceValueUSD || 0}
                                    onChange={e => setDocForm({...docForm, invoiceValueUSD: Number(e.target.value)})}
                                    placeholder="e.g. 45000"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Precise Cargo Description (Harmonized with Customs)</label>
                                <Textarea
                                    className="mt-1"
                                    value={docForm.goodsDescription || ''}
                                    onChange={e => setDocForm({...docForm, goodsDescription: e.target.value})}
                                    rows={3}
                                    placeholder="Complete commercial description detailing grades, weight, structure..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Total Duty Amount (IDR Estimated)</label>
                                <Input
                                    type="number"
                                    className="mt-1"
                                    value={docForm.dutyAmountIDR || 0}
                                    onChange={e => setDocForm({...docForm, dutyAmountIDR: Number(e.target.value)})}
                                    placeholder="Calculated Import duties / levies"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Customs Flow Status</label>
                                <Select value={docForm.status || 'Draft'} onValueChange={val => setDocForm({...docForm, status: val})}>
                                    <SelectTrigger className="mt-1 w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Sent">Sent / APPD</SelectItem>
                                        <SelectItem value="Jalur Hijau">Jalur Hijau (Automatic Release)</SelectItem>
                                        <SelectItem value="Jalur Kuning">Jalur Kuning (Document Verification Required)</SelectItem>
                                        <SelectItem value="Jalur Merah">Jalur Merah (Physical Examination Required)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-700">
                            <Button type="button" variant="outline" onClick={() => { setIsCreatingDoc(false); setIsEditingDoc(false); }} className="px-4 py-2 text-xs uppercase">
                                Cancel
                            </Button>
                            <Button type="submit" className="px-4 py-2 text-xs uppercase">
                                Save Declaration
                            </Button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Declarations List (PIB / PEB Tracker)</h2>
                        <p className="text-xs text-gray-500">Electronically submitted customs declarations in Indonesian channels (Sistem Bea Cukai).</p>
                    </div>
                    <Button onClick={openNewDocForm} className="inline-flex items-center gap-1.5 px-3 py-2" >
                        <Plus className="h-4 w-4" /> Import/Export PIB-PEB
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">ID / Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">No. Aju PIB/PEB</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Exporter/Importer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Classification HS</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Submit Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Flow Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-700">
                                {customsDocs.map(doc => (
                                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-705">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold ${
                                                    doc.type === 'PEB' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                }`}>
                                                    {doc.type}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">#{doc.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-800 dark:text-gray-300 font-medium">
                                            {doc.docNo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate text-gray-700 dark:text-gray-300 font-medium">
                                            {doc.client}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-600 dark:text-gray-400 text-xs">
                                            {doc.hsCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                            {doc.submitDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                doc.status === 'Jalur Hijau' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50' :
                                                doc.status === 'Jalur Kuning' ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50' :
                                                doc.status === 'Jalur Merah' ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50 animate-pulse' :
                                                doc.status === 'Sent' ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30' :
                                                'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800'
                                            }`}>
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-mono font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditDocForm(doc)} title="Edit Document">
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc.id)} title="Delete Document" className="text-red-600">
                                                    <Trash2 className="h-3.5 w-3.5" />
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

    // TRADE LICENSES RENDER
    if (activeSubView === 'trade-licenses') {
        if (isCreatingLicense || isEditingLicense) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono mb-6">
                        {isCreatingLicense ? 'Add Trade Permit & License Certificate' : 'Edit License Properties'}
                    </h2>
                    <form onSubmit={saveLicForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">License / Permit Name</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.name || ''}
                                    onChange={e => setLicForm({...licForm, name: e.target.value})}
                                    placeholder="e.g. Persetujuan Impor (PI)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono font-mono">License Number</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.licenseNumber || ''}
                                    onChange={e => setLicForm({...licForm, licenseNumber: e.target.value})}
                                    placeholder="e.g. 05.PI-23.4983"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono font-mono">Issuing Authority</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.issuedBy || ''}
                                    onChange={e => setLicForm({...licForm, issuedBy: e.target.value})}
                                    placeholder="e.g. Kementerian Perdagangan RI"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono font-mono">Document Classification Category</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.documentType || ''}
                                    onChange={e => setLicForm({...licForm, documentType: e.target.value})}
                                    placeholder="e.g. Import License, Corporate Permit"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Date of Issue</label>
                                <input 
                                    type="date"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.issueDate || ''}
                                    onChange={e => setLicForm({...licForm, issueDate: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Expiry Date (or specify 'Lifetime')</label>
                                <input 
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.expiryDate || ''}
                                    onChange={e => setLicForm({...licForm, expiryDate: e.target.value})}
                                    placeholder="e.g. 2028-12-31 or Lifetime"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Validity Status</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={licForm.status || 'Active'}
                                    onChange={e => setLicForm({...licForm, status: e.target.value as any})}
                                    required
                                >
                                    <option value="Active">Active / Valid</option>
                                    <option value="Warning">Warning (Expiring Soon)</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-700">
                            <button 
                                type="button"
                                onClick={() => { setIsCreatingLicense(false); setIsEditingLicense(false); }}
                                className="px-4 py-2 border rounded text-xs tracking-wider uppercase font-mono font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs tracking-wider uppercase font-mono font-medium"
                            >
                                Save Permit License
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
                        <h2 className="text-lg font-bold font-mono text-gray-900 dark:text-gray-50">Enterprise Trade Permits & Licenses</h2>
                        <p className="text-xs text-gray-500">Track expirations, validity status, and metadata for import/export legal compliance certificates.</p>
                    </div>
                    <button 
                        onClick={openNewLicForm}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs tracking-wider uppercase font-mono font-medium shadow"
                    >
                        <Plus className="h-4 w-4" /> Add Trade Permit
                    </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {licenses.map(lic => {
                        const expired = lic.status === 'Expired';
                        const warning = lic.status === 'Warning';
                        return (
                            <div 
                                key={lic.id} 
                                className={`rounded-lg border p-5 bg-white shadow-sm dark:bg-gray-800 ${
                                    expired ? 'border-red-200 dark:border-red-950/80 bg-red-50/5' :
                                    warning ? 'border-amber-200 dark:border-amber-950/80 bg-amber-50/5' :
                                    'border-gray-100 dark:border-gray-700'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded dark:bg-gray-900/60">
                                        {lic.documentType}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        expired ? 'bg-red-100 text-red-800' :
                                        warning ? 'bg-amber-100 text-amber-800' :
                                        'bg-emerald-100 text-emerald-800'
                                    }`}>
                                        {lic.status}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-100 font-serif leading-tight">
                                    {lic.name}
                                </h3>
                                <p className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400">
                                    No: {lic.licenseNumber}
                                </p>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs space-y-1 text-gray-600 dark:text-gray-400">
                                    <div><span className="font-mono text-gray-400">Authority:</span> {lic.issuedBy}</div>
                                    <div><span className="font-mono text-gray-400">Expiry:</span> <strong className={expired ? 'text-red-600' : warning ? 'text-amber-600 font-bold' : 'text-gray-700 dark:text-gray-350'}>{lic.expiryDate}</strong></div>
                                </div>

                                <div className="mt-4 flex gap-2 justify-end border-t pt-3 dark:border-gray-700">
                                    <button 
                                        onClick={() => openEditLicForm(lic)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-mono font-medium dark:text-blue-400 flex items-center gap-1"
                                    >
                                        <Edit2 className="h-3 w-3" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteLicense(lic.id)}
                                        className="text-xs text-red-500 hover:text-red-700 font-mono font-medium flex items-center gap-1"
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

    // DUTY TARIFFS INSW LOOKUP RENDER
    if (activeSubView === 'duty-tariffs') {
        return (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-base font-bold font-mono text-gray-900 dark:text-gray-50 flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-indigo-500" /> INSW HS Tariff Lookup & Taxation Simulator
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Interactively query Indonesian custom HS Codes tariffs parameters and simulate exact import taxes due.</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Enter HS Code (or search text)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input 
                                        type="text"
                                        className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-mono"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Type code like 0901, 8471, 6204 or select below..."
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest font-mono">Customs CIF Value (USD FOB + freight + insurance)</label>
                                <input 
                                    type="number"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    value={customValUSD}
                                    onChange={e => setCustomValUSD(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* HS Codes List Pre-seeded */}
                    <div className="bg-white p-6 rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono mb-4">Sample HS Customs Registries</h3>
                        <div className="divide-y divide-gray-150 dark:divide-gray-700 max-h-96 overflow-y-auto">
                            {hsDatabase.map((hs) => (
                                <button
                                    key={hs.hsCode}
                                    onClick={() => selectHSTariff(hs)}
                                    className="w-full text-left py-3 px-2 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 dark:hover:bg-gray-705 transition-colors"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-white">
                                                {hs.hsCode}
                                            </span>
                                            {hs.lartas && (
                                                <span className="text-[9px] font-bold tracking-wider font-mono uppercase bg-red-100 border border-red-200 text-red-700 px-1 py-px rounded">
                                                    Restricted (Lartas)
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-sm sm:max-w-md">{hs.description}</p>
                                    </div>
                                    <div className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 font-medium whitespace-nowrap">
                                        BM {hs.importDuty}% | PPN {hs.ppn}% | PPh {hs.pph}%
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side calculation feedback */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-lg p-6 shadow-md">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 font-mono">Taxation Simulator Output</h3>
                        
                        {matchedTariff && calculatedTaxDetails ? (
                            <div className="mt-6 space-y-6">
                                <div>
                                    <h4 className="text-xs font-mono text-indigo-200">MATCHED HS CLASSIFICATION</h4>
                                    <p className="text-lg font-bold font-mono tracking-tight text-white mt-1">{matchedTariff.hsCode}</p>
                                    <p className="text-xs text-indigo-100/80 leading-normal mt-1">{matchedTariff.description}</p>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-indigo-800/80 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-indigo-200">Exchange Rate (Kurs Pajak):</span>
                                        <span className="font-mono">Rp {calculatedTaxDetails.exchangeRate.toLocaleString()}/USD</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-indigo-200">CIF Cargo Value (IDR):</span>
                                        <span className="font-mono">Rp {calculatedTaxDetails.cifValueIDR.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mt-2 pt-2 border-t border-indigo-800/40">
                                        <span className="text-indigo-200">Import Duty (Bea Masuk) [{matchedTariff.importDuty}%]:</span>
                                        <span className="font-mono">Rp {calculatedTaxDetails.importDutyValue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-indigo-200">PPN [{matchedTariff.ppn}%]:</span>
                                        <span className="font-mono font-medium">Rp {calculatedTaxDetails.ppnValue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-indigo-200">PPh Impor Art 22 [{matchedTariff.pph}%]:</span>
                                        <span className="font-mono">Rp {calculatedTaxDetails.pphValue.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="bg-white/10 p-4 rounded border border-white/10 flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] font-mono text-indigo-200 uppercase tracking-wider block">Estimated Total Levy</span>
                                        <span className="text-lg font-bold font-mono tracking-tight">Rp {calculatedTaxDetails.totalTax.toLocaleString()}</span>
                                    </div>
                                </div>

                                {matchedTariff.lartas && (
                                    <div className="rounded border border-amber-600/60 bg-amber-950/40 p-4 text-xs mt-4">
                                        <strong className="text-amber-300 font-mono block">⚠️ INDONESIAN LARTAS RESTRICTIONS WARNING</strong>
                                        <span className="text-amber-100/90 leading-relaxed block mt-1">
                                            {matchedTariff.restrictedReq}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8 text-center text-indigo-200 py-12">
                                <Search className="h-8 w-8 mx-auto stroke-1.5 opacity-50 mb-3" />
                                <p className="text-xs font-mono leading-relaxed">
                                    Please enter or select a valid Indonesian Harmonized System (HS) code to calculate duties & verify active Trade restrictions (Lartas).
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // DEFAULT COMPLIANCE DASHBOARD
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-mono">Compliance & Regulatory Control</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Stay structurally compliant with Indonesian National Single Window (INSW) customs tariffs specifications, PIB/PEB declarations, and expiring legal trade permits.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <button 
                    onClick={() => setActiveSubView('customs-declarations')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <Landmark className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Customs Declarations</h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-normal">
                        Draft officially declared PIB/PEB documentation, and monitor Customs flow status through green/yellow/red lanes.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100">
                        Open Declarations &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('trade-licenses')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <ShieldCheck className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Trade Licenses</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Keep track of active perizinan, import quotas, and quarantine certifications with automated expiry alerts.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100">
                        Manage Licenses &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('duty-tariffs')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <Calculator className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Duty Tariffs</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Instantly consult HS tariffs, taxes coefficients, and restricted item import barriers (Lartas) via the simulator.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100">
                        Open Lookup Simulator &rarr;
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ComplianceView;
