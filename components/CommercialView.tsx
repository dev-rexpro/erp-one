import React, { useState, useEffect } from 'react';
import CustomerManagementView from './CustomerManagementView';
import CustomerDetailView from './CustomerDetailView';
import NewCustomerView from './NewCustomerView';
import QuotationListView from './QuotationListView';
import QuotationDetailView from './QuotationDetailView';
import CustomerContractListView from './CustomerContractListView';
import CustomerContractDetailView from './CustomerContractDetailView';
import type { Customer, Quotation, CustomerContract, Breadcrumb } from '../types';
import { CUSTOMERS_DATA, QUOTATIONS_DATA, CUSTOMER_CONTRACTS_DATA } from '../constants';
import { BriefcaseIcon, DocumentReportIcon, UsersIcon } from '../constants';
import { dbService } from '../services/dbService';

interface CommercialViewProps {
    activeSubView: string | null;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const CommercialView: React.FC<CommercialViewProps> = ({ 
    activeSubView, 
    setActiveSubView, 
    setBreadcrumbs, 
    isSidebarOpen, 
    setIsSidebarOpen 
}) => {
    // -------------------------------------------------------------------------
    // Persistent Dynamic States
    // -------------------------------------------------------------------------
    const [customers, setCustomers] = useState<Customer[]>(() => {
        const cached = localStorage.getItem('CUSTOMERS_DATA');
        return cached ? JSON.parse(cached) : CUSTOMERS_DATA;
    });

    const [quotations, setQuotations] = useState<Quotation[]>(() => {
        const cached = localStorage.getItem('QUOTATIONS_DATA');
        return cached ? JSON.parse(cached) : QUOTATIONS_DATA;
    });

    const [contracts, setContracts] = useState<CustomerContract[]>(() => {
        const cached = localStorage.getItem('CUSTOMER_CONTRACTS_DATA');
        return cached ? JSON.parse(cached) : CUSTOMER_CONTRACTS_DATA;
    });

    // Load states asynchronously from Supabase on mount
    useEffect(() => {
        const loadSupabaseData = async () => {
            const fetchedCustomers = await dbService.fetchAll('clients', 'CUSTOMERS_DATA', CUSTOMERS_DATA);
            setCustomers(fetchedCustomers);

            const fetchedQuotations = await dbService.fetchAll('quotations', 'QUOTATIONS_DATA', QUOTATIONS_DATA);
            setQuotations(fetchedQuotations);

            const fetchedContracts = await dbService.fetchAll('customer_contracts', 'CUSTOMER_CONTRACTS_DATA', CUSTOMER_CONTRACTS_DATA);
            setContracts(fetchedContracts);
        };
        loadSupabaseData();
    }, []);

    // Save states to LocalStorage & Supabase
    useEffect(() => {
        dbService.syncState('clients', 'CUSTOMERS_DATA', customers);
    }, [customers]);

    useEffect(() => {
        dbService.syncState('quotations', 'QUOTATIONS_DATA', quotations);
    }, [quotations]);

    useEffect(() => {
        dbService.syncState('customer_contracts', 'CUSTOMER_CONTRACTS_DATA', contracts);
    }, [contracts]);

    // -------------------------------------------------------------------------
    // Sub-view UI States
    // -------------------------------------------------------------------------
    const [customerViewState, setCustomerViewState] = useState<'list' | 'detail' | 'new-customer'>('list');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isCustomerSubPanelOpen, setIsCustomerSubPanelOpen] = useState(() => {
        const saved = localStorage.getItem('isCustomerSubPanelOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [quotationViewState, setQuotationViewState] = useState<'list' | 'detail'>('list');
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [isQuotationSubPanelOpen, setIsQuotationSubPanelOpen] = useState(() => {
        const saved = localStorage.getItem('isQuotationSubPanelOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    
    const [contractViewState, setContractViewState] = useState<'list' | 'detail'>('list');
    const [selectedContract, setSelectedContract] = useState<CustomerContract | null>(null);
    const [isContractSubPanelOpen, setIsContractSubPanelOpen] = useState(() => {
        const saved = localStorage.getItem('isContractSubPanelOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Save UI states to LocalStorage
    useEffect(() => {
        localStorage.setItem('isCustomerSubPanelOpen', JSON.stringify(isCustomerSubPanelOpen));
    }, [isCustomerSubPanelOpen]);

    useEffect(() => {
        localStorage.setItem('isQuotationSubPanelOpen', JSON.stringify(isQuotationSubPanelOpen));
    }, [isQuotationSubPanelOpen]);

    useEffect(() => {
        localStorage.setItem('isContractSubPanelOpen', JSON.stringify(isContractSubPanelOpen));
    }, [isContractSubPanelOpen]);



    const handleBackToModuleDashboard = () => {
        setActiveSubView('dashboard');
    };

    // -------------------------------------------------------------------------
    // Customer Handlers & Save
    // -------------------------------------------------------------------------
    const handleCustomerSelect = (customer: Customer) => {
        const latest = customers.find(c => c.id === customer.id) || customer;
        setSelectedCustomer(latest);
        setCustomerViewState('detail');
    };
    const handleBackToCustomerList = () => {
        setSelectedCustomer(null);
        setCustomerViewState('list');
    };
    const handleAddNewCustomer = () => {
        setCustomerViewState('new-customer');
    };
    const toggleCustomerSubPanel = () => setIsCustomerSubPanelOpen(!isCustomerSubPanelOpen);

    const handleSaveCustomer = (updated: Customer) => {
        setCustomers(prev => {
            const exists = prev.some(c => c.id === updated.id);
            if (exists) {
                return prev.map(c => c.id === updated.id ? updated : c);
            } else {
                return [updated, ...prev];
            }
        });
        if (selectedCustomer && selectedCustomer.id === updated.id) {
            setSelectedCustomer(updated);
        }
    };

    // -------------------------------------------------------------------------
    // Quotation Handlers & Save
    // -------------------------------------------------------------------------
    const handleQuotationSelect = (quotation: Quotation) => {
        setSelectedQuotation(quotation);
        setQuotationViewState('detail');
    };
    const handleAddQuotation = () => {
        setSelectedQuotation(null);
        setQuotationViewState('detail');
    };
    const handleBackToQuotationList = () => {
        setSelectedQuotation(null);
        setQuotationViewState('list');
    };
    const toggleQuotationSubPanel = () => setIsQuotationSubPanelOpen(!isQuotationSubPanelOpen);

    const handleSaveQuotation = (updated: Quotation) => {
        setQuotations(prev => {
            const exists = prev.some(q => q.id === updated.id);
            if (exists) {
                return prev.map(q => q.id === updated.id ? updated : q);
            } else {
                return [updated, ...prev];
            }
        });
        setQuotationViewState('list');
        setSelectedQuotation(null);
    };

    // -------------------------------------------------------------------------
    // Contract Handlers & Save
    // -------------------------------------------------------------------------
    const handleContractSelect = (contract: CustomerContract) => {
        setSelectedContract(contract);
        setContractViewState('detail');
    };
    const handleAddContract = () => {
        setSelectedContract(null);
        setContractViewState('detail');
    };
    const handleBackToContractList = () => {
        setSelectedContract(null);
        setContractViewState('list');
    };
    const toggleContractSubPanel = () => setIsContractSubPanelOpen(!isContractSubPanelOpen);

    const handleSaveContract = (updated: CustomerContract) => {
        setContracts(prev => {
            const exists = prev.some(c => c.id === updated.id);
            if (exists) {
                return prev.map(c => c.id === updated.id ? updated : c);
            } else {
                return [updated, ...prev];
            }
        });
        setContractViewState('list');
        setSelectedContract(null);
    };

    // Breadcrumbs Controller
    useEffect(() => {
        const baseCrumb: Breadcrumb = { label: 'Commercial', onClick: handleBackToModuleDashboard };
        
        if (activeSubView === 'client-accounts') {
            const customerListCrumb: Breadcrumb = { label: 'Client Accounts', onClick: handleBackToCustomerList };
            if (customerViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Client Accounts' }]);
            } else if (customerViewState === 'detail' && selectedCustomer) {
                setBreadcrumbs([baseCrumb, customerListCrumb, { label: selectedCustomer.name }]);
            } else if (customerViewState === 'new-customer') {
                setBreadcrumbs([baseCrumb, customerListCrumb, { label: 'New Client Account' }]);
            }
        } else if (activeSubView === 'service-quotations') {
            const quotationListCrumb: Breadcrumb = { label: 'Service Quotations', onClick: handleBackToQuotationList };
            if (quotationViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Service Quotations' }]);
            } else if (quotationViewState === 'detail') {
                 if (selectedQuotation) {
                    setBreadcrumbs([baseCrumb, quotationListCrumb, { label: selectedQuotation.clientName }]);
                 } else {
                    setBreadcrumbs([baseCrumb, quotationListCrumb, { label: 'New Quotation' }]);
                 }
            }
        } else if (activeSubView === 'client-contracts') {
            const contractListCrumb: Breadcrumb = { label: 'Client Contracts', onClick: handleBackToContractList };
            if (contractViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Client Contracts' }]);
            } else if (contractViewState === 'detail') {
                 if (selectedContract) {
                    setBreadcrumbs([baseCrumb, contractListCrumb, { label: selectedContract.contractId }]);
                 } else {
                    setBreadcrumbs([baseCrumb, contractListCrumb, { label: 'New Client Contract' }]);
                 }
            }
        } else {
            setBreadcrumbs([baseCrumb]);
        }
    }, [activeSubView, customerViewState, selectedCustomer, quotationViewState, selectedQuotation, contractViewState, selectedContract, setBreadcrumbs]);
    
    // Render
    if (activeSubView === 'client-accounts') {
        if (customerViewState === 'detail' && selectedCustomer) {
            return (
                <CustomerDetailView 
                    customer={selectedCustomer} 
                    onBack={handleBackToCustomerList}
                    onSaveCustomer={handleSaveCustomer}
                    isSubPanelOpen={isCustomerSubPanelOpen}
                    toggleSubPanel={toggleCustomerSubPanel}
                />
            );
        }
        if (customerViewState === 'new-customer') {
            return (
                <NewCustomerView 
                    onBack={handleBackToCustomerList} 
                    onSave={handleSaveCustomer}
                />
            );
        }
        return (
            <CustomerManagementView 
                customers={customers}
                onCustomerSelect={handleCustomerSelect}
                onAddNew={handleAddNewCustomer}
            />
        );
    }

    if (activeSubView === 'service-quotations') {
        if (quotationViewState === 'detail') {
            return (
                <QuotationDetailView 
                    quotation={selectedQuotation} 
                    onBack={handleBackToQuotationList} 
                    onSave={handleSaveQuotation}
                />
            );
        }
        return (
            <QuotationListView 
                quotations={quotations}
                onQuotationSelect={handleQuotationSelect}
                onAddQuotation={handleAddQuotation}
            />
        );
    }
    
    if (activeSubView === 'client-contracts') {
        if (contractViewState === 'detail') {
            return (
                <CustomerContractDetailView 
                    contract={selectedContract} 
                    onBack={handleBackToContractList}
                    onSave={handleSaveContract}
                />
            );
        }
        return (
            <CustomerContractListView
                contracts={contracts}
                onContractSelect={handleContractSelect}
                onAddContract={handleAddContract}
            />
        );
    }

    // Default dashboard for Commercial Segment
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 font-mono">Commercial Hub</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Manage your customer relations, calculate services cargo quotations, and enforce term-of-payment (TOP) rates contracts easily in our global-grade workspace.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <button 
                    onClick={() => setActiveSubView('client-accounts')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <UsersIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Client Accounts</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Manage database profiles of exporters/importers, field agents, overseas networks, and interactions history.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Accounts &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('service-quotations')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <DocumentReportIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Service Quotations</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Structure buy/sell logistics item items, calculate prices, and issue professional service proposals instantly.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Quotations &rarr;
                    </span>
                </button>

                <button 
                    onClick={() => setActiveSubView('client-contracts')}
                    className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-all hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                >
                    <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-700">
                        <BriefcaseIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white font-mono">Client Contracts</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        Lock in long-term freight agreements, contract durations, and signed payment terms (TOP) on file.
                    </p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-gray-900 hover:underline dark:text-gray-100">
                        Open Contracts &rarr;
                    </span>
                </button>
            </div>
        </div>
    );
};

export default CommercialView;
