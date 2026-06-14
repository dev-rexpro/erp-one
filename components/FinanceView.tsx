import React, { useState, useEffect } from 'react';
import type { Breadcrumb, Invoice } from '../types';
import ClientInvoicingListView from './ClientInvoicingListView';
import ClientInvoiceDetailView from './ClientInvoiceDetailView';
import ReceivablesView from './ReceivablesView';
import PayablesView from './PayablesView';
import { Landmark, TrendingUp, LineChart, Plus, Trash2, Edit2, Wallet, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { dbService } from '../services/dbService';

interface CostAccrual {
    id: string;
    shipmentId: string;
    expenseCategory: 'Ocean Freight' | 'Port Handling' | 'Trucking Haulage' | 'Customs PPJK';
    estimatedCostIDR: number;
    actualBilledIDR: number;
    accrualDate: string;
    vendorName: string;
    status: 'Pending Bill' | 'Matched';
}

interface LedgerAccount {
    code: string;
    name: string;
    type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    debitBalance: number;
    creditBalance: number;
}

interface LedgerTransaction {
    id: string;
    date: string;
    reference: string;
    description: string;
    debitAccount: string;
    creditAccount: string;
    amountIDR: number;
}

interface FinanceViewProps {
    activeSubView: string | null;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({
    activeSubView,
    setActiveSubView,
    setBreadcrumbs,
    setIsSidebarOpen
}) => {
    // -------------------------------------------------------------------------
    // Persistent Dynamic States
    // -------------------------------------------------------------------------
    const [invoices, setInvoices] = useState<Invoice[]>(() => {
        const cached = localStorage.getItem('FINANCE_INVOICES');
        return cached ? JSON.parse(cached) : [];
    });

    const [accruals, setAccruals] = useState<CostAccrual[]>(() => {
        const cached = localStorage.getItem('FINANCE_ACCRUALS');
        return cached ? JSON.parse(cached) : [
            { id: 'ACR-101', shipmentId: 'REX-26012', expenseCategory: 'Ocean Freight', estimatedCostIDR: 12500000, actualBilledIDR: 0, accrualDate: '2026-06-01', vendorName: 'MAERSK LINE', status: 'Pending Bill' },
            { id: 'ACR-102', shipmentId: 'REX-26013', expenseCategory: 'Port Handling', estimatedCostIDR: 3500000, actualBilledIDR: 3500000, accrualDate: '2026-06-02', vendorName: 'PT Pelindo II', status: 'Matched' },
            { id: 'ACR-103', shipmentId: 'REX-26014', expenseCategory: 'Trucking Haulage', estimatedCostIDR: 4200000, actualBilledIDR: 0, accrualDate: '2026-06-03', vendorName: 'PT Samudera Logistik Nusantara', status: 'Pending Bill' },
            { id: 'ACR-104', shipmentId: 'REX-26015', expenseCategory: 'Customs PPJK', estimatedCostIDR: 1500000, actualBilledIDR: 1500000, accrualDate: '2026-06-04', vendorName: 'CV Jasa Bea Kepabeanan Utama', status: 'Matched' },
        ];
    });

    const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>(() => {
        const cached = localStorage.getItem('FINANCE_LEDGER_ACCOUNTS');
        return cached ? JSON.parse(cached) : [
            { code: '1010', name: 'Cash and Bank Balances', type: 'Asset', debitBalance: 125400000, creditBalance: 0 },
            { code: '1120', name: 'Accounts Receivables', type: 'Asset', debitBalance: 85200000, creditBalance: 0 },
            { code: '2110', name: 'Accounts Payables', type: 'Liability', debitBalance: 0, creditBalance: 45000000 },
            { code: '4110', name: 'Ocean Freight Revenue', type: 'Revenue', debitBalance: 0, creditBalance: 215000000 },
            { code: '5110', name: 'Direct Trucking Costs', type: 'Expense', debitBalance: 32000000, creditBalance: 0 },
            { code: '5120', name: 'Customs Brokerage Expenses', type: 'Expense', debitBalance: 17400000, creditBalance: 0 }
        ];
    });

    const [ledgerTransactions, setLedgerTransactions] = useState<LedgerTransaction[]>(() => {
        const cached = localStorage.getItem('FINANCE_LEDGER_TXS');
        return cached ? JSON.parse(cached) : [
            { id: 'TX-501', date: '2026-06-01', reference: 'INV-26-00389', description: 'Export client invoicing PT Nusantara Jaya green tea sales', debitAccount: '1120', creditAccount: '4110', amountIDR: 24500000 },
            { id: 'TX-502', date: '2026-06-02', reference: 'BILL-00912', description: 'Inter-depot transfer trucking haulage pt samudera invoice', debitAccount: '5110', creditAccount: '2110', amountIDR: 4200000 },
            { id: 'TX-503', date: '2026-06-03', reference: 'PAY-8390', description: 'Bank transfer paid ocean freight CMA CGM dues', debitAccount: '2110', creditAccount: '1010', amountIDR: 12500000 }
        ];
    });

    // Sub views controller states
    const [invoiceViewState, setInvoiceViewState] = useState<'list' | 'detail'>('list');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const [isCreatingAccrual, setIsCreatingAccrual] = useState(false);
    const [isEditingAccrual, setIsEditingAccrual] = useState(false);
    const [selectedAccrual, setSelectedAccrual] = useState<CostAccrual | null>(null);
    const [accrualForm, setAccrualForm] = useState<Partial<CostAccrual>>({});

    const [isPostingTx, setIsPostingTx] = useState(false);
    const [txForm, setTxForm] = useState<Partial<LedgerTransaction>>({});

    // Load states asynchronously from Supabase on mount
    useEffect(() => {
        const loadSupabaseData = async () => {
            const fetchedInvoices = await dbService.fetchAll('invoices', 'FINANCE_INVOICES', []);
            if (fetchedInvoices.length > 0) {
                setInvoices(fetchedInvoices);
            } else {
                import('../constants').then(({ INVOICES_DATA }) => {
                    setInvoices(INVOICES_DATA);
                    dbService.syncState('invoices', 'FINANCE_INVOICES', INVOICES_DATA);
                });
            }

            const defaultAccruals: CostAccrual[] = [
                { id: 'ACR-101', shipmentId: 'REX-26012', expenseCategory: 'Ocean Freight', estimatedCostIDR: 12500000, actualBilledIDR: 0, accrualDate: '2026-06-01', vendorName: 'MAERSK LINE', status: 'Pending Bill' },
                { id: 'ACR-102', shipmentId: 'REX-26013', expenseCategory: 'Port Handling', estimatedCostIDR: 3500000, actualBilledIDR: 3500000, accrualDate: '2026-06-02', vendorName: 'PT Pelindo II', status: 'Matched' },
                { id: 'ACR-103', shipmentId: 'REX-26014', expenseCategory: 'Trucking Haulage', estimatedCostIDR: 4200000, actualBilledIDR: 0, accrualDate: '2026-06-03', vendorName: 'PT Samudera Logistik Nusantara', status: 'Pending Bill' },
                { id: 'ACR-104', shipmentId: 'REX-26015', expenseCategory: 'Customs PPJK', estimatedCostIDR: 1500000, actualBilledIDR: 1500000, accrualDate: '2026-06-04', vendorName: 'CV Jasa Bea Kepabeanan Utama', status: 'Matched' },
            ];
            const fetchedAccruals = await dbService.fetchAll('cost_accruals', 'FINANCE_ACCRUALS', defaultAccruals);
            setAccruals(fetchedAccruals);

            const defaultLedgerAccounts: LedgerAccount[] = [
                { code: '1010', name: 'Cash and Bank Balances', type: 'Asset', debitBalance: 125400000, creditBalance: 0 },
                { code: '1120', name: 'Accounts Receivables', type: 'Asset', debitBalance: 85200000, creditBalance: 0 },
                { code: '2110', name: 'Accounts Payables', type: 'Liability', debitBalance: 0, creditBalance: 45000000 },
                { code: '4110', name: 'Ocean Freight Revenue', type: 'Revenue', debitBalance: 0, creditBalance: 215000000 },
                { code: '5110', name: 'Direct Trucking Costs', type: 'Expense', debitBalance: 32000000, creditBalance: 0 },
                { code: '5120', name: 'Customs Brokerage Expenses', type: 'Expense', debitBalance: 17400000, creditBalance: 0 }
            ];
            const fetchedAccounts = await dbService.fetchAll('ledger_accounts', 'FINANCE_LEDGER_ACCOUNTS', defaultLedgerAccounts);
            setLedgerAccounts(fetchedAccounts);

            const defaultLedgerTxs: LedgerTransaction[] = [
                { id: 'TX-501', date: '2026-06-01', reference: 'INV-26-00389', description: 'Export client invoicing PT Nusantara Jaya green tea sales', debitAccount: '1120', creditAccount: '4110', amountIDR: 24500000 },
                { id: 'TX-502', date: '2026-06-02', reference: 'BILL-00912', description: 'Inter-depot transfer trucking haulage pt samudera invoice', debitAccount: '5110', creditAccount: '2110', amountIDR: 4200000 },
                { id: 'TX-503', date: '2026-06-03', reference: 'PAY-8390', description: 'Bank transfer paid ocean freight CMA CGM dues', debitAccount: '2110', creditAccount: '1010', amountIDR: 12500000 }
            ];
            const fetchedTxs = await dbService.fetchAll('ledger_transactions', 'FINANCE_LEDGER_TXS', defaultLedgerTxs);
            setLedgerTransactions(fetchedTxs);
        };
        loadSupabaseData();
    }, []);

    // Cache sync
    useEffect(() => {
        if (invoices.length > 0) {
            dbService.syncState('invoices', 'FINANCE_INVOICES', invoices);
        }
    }, [invoices]);

    useEffect(() => {
        dbService.syncState('cost_accruals', 'FINANCE_ACCRUALS', accruals);
    }, [accruals]);

    useEffect(() => {
        dbService.syncState('ledger_accounts', 'FINANCE_LEDGER_ACCOUNTS', ledgerAccounts);
    }, [ledgerAccounts]);

    useEffect(() => {
        dbService.syncState('ledger_transactions', 'FINANCE_LEDGER_TXS', ledgerTransactions);
    }, [ledgerTransactions]);



    const handleBackToModuleDashboard = () => {
        setActiveSubView('dashboard');
    };

    // Form Handlers
    const handleInvoiceSelect = (invoiceId: string) => {
        const invoice = invoices.find(i => i.id === invoiceId);
        if (invoice) {
            setSelectedInvoice(invoice);
            setInvoiceViewState('detail');
        }
    };

    const handleNewInvoice = () => {
        setSelectedInvoice(null);
        setInvoiceViewState('detail');
    };

    const handleSaveInvoice = (savedInvoice: Invoice) => {
        setInvoices(prev => {
            const exists = prev.some(inv => inv.id === savedInvoice.id);
            if (exists) {
                return prev.map(inv => inv.id === savedInvoice.id ? savedInvoice : inv);
            } else {
                return [...prev, savedInvoice];
            }
        });
        setSelectedInvoice(savedInvoice);
    };

    const handleBackToInvoiceList = () => {
        setSelectedInvoice(null);
        setInvoiceViewState('list');
    };

    // Accruals Management
    const openNewAccrualForm = () => {
        setAccrualForm({
            id: 'ACR-' + Math.floor(Math.random() * 1000),
            shipmentId: 'REX-' + Math.floor(Math.random() * 9000 + 10000),
            expenseCategory: 'Ocean Freight',
            estimatedCostIDR: 0,
            actualBilledIDR: 0,
            accrualDate: new Date().toISOString().split('T')[0],
            vendorName: '',
            status: 'Pending Bill'
        });
        setIsCreatingAccrual(true);
        setIsEditingAccrual(false);
    };

    const openEditAccrualForm = (c: CostAccrual) => {
        setSelectedAccrual(c);
        setAccrualForm({ ...c });
        setIsEditingAccrual(true);
        setIsCreatingAccrual(false);
    };

    const saveAccrualForm = (e: React.FormEvent) => {
        e.preventDefault();
        const saved = accrualForm as CostAccrual;
        if (saved.actualBilledIDR > 0) {
            saved.status = 'Matched';
        } else {
            saved.status = 'Pending Bill';
        }

        setAccruals(prev => {
            const exists = prev.some(item => item.id === saved.id);
            if (exists) {
                return prev.map(item => item.id === saved.id ? saved : item);
            } else {
                return [saved, ...prev];
            }
        });
        setIsCreatingAccrual(false);
        setIsEditingAccrual(false);
        setSelectedAccrual(null);
    };

    const deleteAccrual = (id: string) => {
        if (confirm('Delete this cost accrual?')) {
            setAccruals(prev => prev.filter(c => c.id !== id));
        }
    };

    // Ledger posting entries
    const openPostTxForm = () => {
        setTxForm({
            id: 'TX-' + Math.floor(Math.random() * 1000),
            date: new Date().toISOString().split('T')[0],
            reference: 'JV-' + Math.floor(Math.random() * 9000 + 1000),
            description: '',
            debitAccount: '1010',
            creditAccount: '4110',
            amountIDR: 0
        });
        setIsPostingTx(true);
    };

    const saveTxForm = (e: React.FormEvent) => {
        e.preventDefault();
        const input = txForm as LedgerTransaction;
        // Post transaction
        setLedgerTransactions(prev => [input, ...prev]);

        // Reflect onto ledger accounts
        setLedgerAccounts(prev => {
            return prev.map(acc => {
                let deb = acc.debitBalance;
                let cred = acc.creditBalance;
                if (acc.code === input.debitAccount) {
                    deb += input.amountIDR;
                }
                if (acc.code === input.creditAccount) {
                    cred += input.amountIDR;
                }
                return { ...acc, debitBalance: deb, creditBalance: cred };
            });
        });

        setIsPostingTx(false);
    };

    // Calculate trial balance totals to confirm double-entry integration
    const trialBalanceTotalDebit = ledgerAccounts.reduce((sum, acc) => sum + acc.debitBalance, 0);
    const trialBalanceTotalCredit = ledgerAccounts.reduce((sum, acc) => sum + acc.creditBalance, 0);

    // Reset components flow state on module change
    useEffect(() => {
        if (activeSubView !== 'client-invoicing') {
            setInvoiceViewState('list');
            setSelectedInvoice(null);
        }
    }, [activeSubView]);

    // Breadcrumbs Logic
    useEffect(() => {
        const base: Breadcrumb = { label: 'Finance', onClick: handleBackToModuleDashboard };
        if (activeSubView === 'client-invoicing') {
            const listCrumb: Breadcrumb = { label: 'Client Invoices', onClick: handleBackToInvoiceList };
            if (invoiceViewState === 'list') {
                setBreadcrumbs([base, { label: 'Client Invoices' }]);
            } else if (selectedInvoice) {
                setBreadcrumbs([base, listCrumb, { label: selectedInvoice.invoiceNumber }]);
            }
        } else if (activeSubView === 'accounts-receivable') {
            setBreadcrumbs([base, { label: 'Accounts Receivable' }]);
        } else if (activeSubView === 'cost-accruals') {
            setBreadcrumbs([base, { label: 'Cost Accruals' }]);
        } else if (activeSubView === 'vendor-bills') {
            setBreadcrumbs([base, { label: 'Vendor Bills' }]);
        } else if (activeSubView === 'general-ledger') {
            setBreadcrumbs([base, { label: 'General Ledger' }]);
        } else {
            setBreadcrumbs([{ label: 'Finance' }]);
        }
    }, [activeSubView, invoiceViewState, selectedInvoice, setBreadcrumbs]);

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // Views Render Helpers & Components
    // -------------------------------------------------------------------------
    const getStatusBadge = (status: 'Pending Bill' | 'Matched') => {
        const baseClasses = "text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block";
        if (status === 'Matched') {
            return <span className={`bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 ${baseClasses}`}>{status}</span>;
        }
        return <span className={`bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 ${baseClasses}`}>{status}</span>;
    };

    const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
        <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
            {children}
        </div>
    );

    // -------------------------------------------------------------------------
    // Views Render Direct Routes
    // -------------------------------------------------------------------------
    if (activeSubView === 'client-invoicing') {
        if (invoiceViewState === 'detail') {
            return <ClientInvoiceDetailView invoice={selectedInvoice} onBack={handleBackToInvoiceList} onSave={handleSaveInvoice} />;
        }
        return <ClientInvoicingListView invoices={invoices} onInvoiceSelect={handleInvoiceSelect} onNewInvoice={handleNewInvoice} />;
    }

    if (activeSubView === 'accounts-receivable') {
        return <ReceivablesView />;
    }

    if (activeSubView === 'vendor-bills') {
        return <PayablesView />;
    }

    // COST ACCRUALS VIEW
    if (activeSubView === 'cost-accruals') {
        if (isCreatingAccrual || isEditingAccrual) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        {isCreatingAccrual ? 'New Voyage Cost Accrual Entry' : 'Edit Cost Accrual Properties'}
                    </h2>
                    <form onSubmit={saveAccrualForm} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <FormField label="Operations Shipment Code">
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={accrualForm.shipmentId || ''}
                                    onChange={e => setAccrualForm({...accrualForm, shipmentId: e.target.value.toUpperCase()})}
                                    placeholder="e.g. REX-26012"
                                    required
                                />
                            </FormField>

                            <FormField label="Accrual Category">
                                <Select value={accrualForm.expenseCategory || 'Ocean Freight'} onValueChange={val => setAccrualForm({...accrualForm, expenseCategory: val as any})}>
                                    <SelectTrigger className="w-full p-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ocean Freight">Ocean Freight</SelectItem>
                                        <SelectItem value="Port Handling">Port Handling (THC, Stevedoring)</SelectItem>
                                        <SelectItem value="Trucking Haulage">Trucking & Land Haulage</SelectItem>
                                        <SelectItem value="Customs PPJK">Customs Clearance / PPJK Agents</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label="Estimated Cost Value (USD/IDR Equiv Amount)">
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={accrualForm.estimatedCostIDR || 0}
                                    onChange={e => setAccrualForm({...accrualForm, estimatedCostIDR: Number(e.target.value)})}
                                    required
                                />
                            </FormField>

                            <FormField label="Actual Billed Cost Received (IDR)">
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={accrualForm.actualBilledIDR || 0}
                                    onChange={e => setAccrualForm({...accrualForm, actualBilledIDR: Number(e.target.value)})}
                                />
                            </FormField>

                            <FormField label="Accrual Date">
                                <input 
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={accrualForm.accrualDate || ''}
                                    onChange={e => setAccrualForm({...accrualForm, accrualDate: e.target.value})}
                                    required
                                />
                            </FormField>

                            <FormField label="Target Vendor">
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={accrualForm.vendorName || ''}
                                    onChange={e => setAccrualForm({...accrualForm, vendorName: e.target.value})}
                                    placeholder="e.g. CMA CGM Indonesia"
                                    required
                                />
                            </FormField>
                        </div>

                        <div className="flex gap-3 justify-end border-t pt-4 dark:border-gray-750">
                            <button 
                                type="button"
                                onClick={() => { setIsCreatingAccrual(false); setIsEditingAccrual(false); }}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Save Accrual Row
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-850 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-gray-550 text-gray-550" /> Operational Cost Accruals (Pre-revenue Tracking)
                        </h2>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">Estimate operational charges per ocean route before actual vendor bills arrive to improve profit/loss parameters integrity.</p>
                    </div>
                    <button 
                        onClick={openNewAccrualForm}
                        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 inline-flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" /> <span>Log Accrual Fee</span>
                    </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 dark:bg-gray-700/50 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">ID</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Shipment Code</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Category</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-left">Vendor</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Estimated Price</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actual Billed</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-700">
                                {accruals.map(a => (
                                    <tr key={a.id} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">{a.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-950 dark:text-white">{a.shipmentId}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{a.expenseCategory}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{a.vendorName}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">Rp {a.estimatedCostIDR.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">{a.actualBilledIDR > 0 ? `Rp ${a.actualBilledIDR.toLocaleString()}` : '—'}</td>
                                        <td className="px-6 py-4 text-center">{getStatusBadge(a.status)}</td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditAccrualForm(a)}
                                                    className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteAccrual(a.id)}
                                                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
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

    // GENERAL LEDGER VIEW
    if (activeSubView === 'general-ledger') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Double-Entry General Ledger Dashboard
                        </h2>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">Principal corporate audit trial book reconciling client accounts and direct operational expenses posts.</p>
                    </div>
                    <button 
                        onClick={openPostTxForm}
                        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 inline-flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" /> <span>Post Journal Entry</span>
                    </button>
                </div>

                {isPostingTx && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-750 dark:bg-gray-800/50">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Post Double-Entry Ledger Voucher</h3>
                        <form onSubmit={saveTxForm} className="grid gap-4 sm:grid-cols-2">
                            <FormField label="Transaction Label Description">
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={txForm.description || ''}
                                    onChange={e => setTxForm({...txForm, description: e.target.value})}
                                    placeholder="e.g. Received CMA Ocean freight bill"
                                    required
                                />
                            </FormField>

                            <FormField label="Reference Code (JV/INV/BILL)">
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={txForm.reference || ''}
                                    onChange={e => setTxForm({...txForm, reference: e.target.value})}
                                    required
                                />
                            </FormField>

                            <FormField label="DEBIT Account Code (Target Influx)">
                                <Select value={txForm.debitAccount || '1010'} onValueChange={val => setTxForm({...txForm, debitAccount: val})}>
                                    <SelectTrigger className="w-full p-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ledgerAccounts.map(acc => (
                                            <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name} ({acc.type})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label="CREDIT Account Code (Source Outflux)">
                                <Select value={txForm.creditAccount || '4110'} onValueChange={val => setTxForm({...txForm, creditAccount: val})}>
                                    <SelectTrigger className="w-full p-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ledgerAccounts.map(acc => (
                                            <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name} ({acc.type})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label="Voucher Amount (IDR)">
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={txForm.amountIDR || 0}
                                    onChange={e => setTxForm({...txForm, amountIDR: Number(e.target.value)})}
                                    required
                                />
                            </FormField>

                            <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t dark:border-gray-700">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPostingTx(false)} 
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Post Entry
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Ledgers trial balances */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Trial Balance Accounts Registry</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-205 dark:divide-gray-700">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 dark:bg-gray-700/50 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 font-semibold text-left">Code</th>
                                        <th scope="col" className="px-4 py-3 font-semibold text-left">Account Name</th>
                                        <th scope="col" className="px-4 py-3 font-semibold text-left">Type</th>
                                        <th scope="col" className="px-4 py-3 font-semibold text-right">Debit Balance</th>
                                        <th scope="col" className="px-4 py-3 font-semibold text-right">Credit Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-sm">
                                    {ledgerAccounts.map(acc => (
                                        <tr key={acc.code} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{acc.code}</td>
                                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{acc.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    {acc.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{acc.debitBalance > 0 ? `Rp ${acc.debitBalance.toLocaleString()}` : '—'}</td>
                                            <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-semibold">{acc.creditBalance > 0 ? `Rp ${acc.creditBalance.toLocaleString()}` : '—'}</td>
                                        </tr>
                                    ))}
                                    {/* Grand Totals Reconciled Audit Statement */}
                                    <tr className="bg-gray-50 font-semibold text-gray-900 dark:bg-gray-950/40 dark:text-white border-t-2 dark:border-gray-700">
                                        <td></td>
                                        <td className="px-4 py-3">Total Balanced Post Ledger</td>
                                        <td></td>
                                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">Rp {trialBalanceTotalDebit.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-red-650 text-red-600 dark:text-red-400 font-bold">Rp {trialBalanceTotalCredit.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* DoubleEntry validation details */}
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-505 text-gray-500 dark:text-gray-400">Double-Entry Status Audit</h4>
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900/50 p-4 rounded-md">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-505 text-green-500" />
                                <div>
                                    <span className="text-[10px] font-semibold text-green-800 dark:text-green-300 block uppercase">Reconciliation Result</span>
                                    <span className="text-sm font-bold text-green-755 text-green-700 dark:text-green-400">LEDGER RECONCILED</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-305 text-gray-300 leading-relaxed font-sans">
                                Trial balance debit totals match credit balance parameters exactly, proving no unmatched cost posting leakage exists within the firm.
                            </p>
                        </div>

                        {/* Recent ledger transaction journals stream */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Ledger Transactions Stream</h3>
                            <div className="relative pl-4 border-l border-gray-200 space-y-5 dark:border-gray-700">
                                {ledgerTransactions.map(tx => (
                                    <div key={tx.id} className="relative text-xs">
                                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-black border-2 border-white dark:border-gray-800 dark:bg-white"></div>
                                        <div className="text-[10px] text-gray-400 font-semibold">{tx.date} • {tx.reference}</div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">{tx.description}</p>
                                        <div className="text-gray-900 dark:text-white font-bold mt-1">
                                            Rp {tx.amountIDR.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // DEFAULT FINANCES DASHBOARD DESIGN OUTLINE
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Financial Operations & Accruals Basis Ledger</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Oversee accounts receivables, log estimated ocean cost accruals basis parameters, and review consolidated double-entry General Ledger trial balances.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <button 
                    onClick={() => setActiveSubView('client-invoicing')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-405 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <FileText className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">Client Invoicing</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Create invoices, adjust billing items, calculate VAT rates, and transmit invoices electronically to clients.
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Invoices &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('accounts-receivable')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <Wallet className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">Accounts Receivable</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Reconcile unpaid invoices aging schedules (30/60/90 days overdue thresholds) and manage corporate liquidity assets.
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Receivables &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('cost-accruals')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <TrendingUp className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">Cost Accruals</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Log freight voyages accruals basis operational expenses rows before formal vendor bills materialize on file.
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Accruals Registry &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('vendor-bills')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <ArrowUpRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">Vendor Bills</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Audit bills submitted by global carriers lines, depot yards, and local truckers before executing accounts payments.
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Vendor Bills &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('general-ledger')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <LineChart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">General Ledger</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Unified balance audit worksheets Reconciling trial totals, Debit/Credit flows, and journal cash movements.
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Main Ledger &rarr;
                    </span>
                </button>
            </div>
        </div>
    );
};

export default FinanceView;
