import React, { useState, useEffect } from 'react';
import CustomerManagementView from './CustomerManagementView';
import CustomerDetailView from './CustomerDetailView';
import NewCustomerView from './NewCustomerView';
import QuotationListView from './QuotationListView';
import QuotationDetailView from './QuotationDetailView';
import CustomerContractListView from './CustomerContractListView';
import CustomerContractDetailView from './CustomerContractDetailView';
import type { Customer, Quotation, CustomerContract, Breadcrumb } from '../types';
import SalesClientsDashboard from './SalesClientsDashboard';
import { CUSTOMERS_DATA, QUOTATIONS_DATA, CUSTOMER_CONTRACTS_DATA } from '../constants';

interface SalesClientsViewProps {
    activeSubView: string | null;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const SalesClientsView: React.FC<SalesClientsViewProps> = ({ 
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

    // Save states to LocalStorage
    useEffect(() => {
        localStorage.setItem('CUSTOMERS_DATA', JSON.stringify(customers));
    }, [customers]);

    useEffect(() => {
        localStorage.setItem('QUOTATIONS_DATA', JSON.stringify(quotations));
    }, [quotations]);

    useEffect(() => {
        localStorage.setItem('CUSTOMER_CONTRACTS_DATA', JSON.stringify(contracts));
    }, [contracts]);

    // -------------------------------------------------------------------------
    // Sub-view UI States
    // -------------------------------------------------------------------------
    const [customerViewState, setCustomerViewState] = useState<'list' | 'detail' | 'new-customer'>('list');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isCustomerSubPanelOpen, setIsCustomerSubPanelOpen] = useState(true);

    const [quotationViewState, setQuotationViewState] = useState<'list' | 'detail'>('list');
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [isQuotationSubPanelOpen, setIsQuotationSubPanelOpen] = useState(true);
    
    const [contractViewState, setContractViewState] = useState<'list' | 'detail'>('list');
    const [selectedContract, setSelectedContract] = useState<CustomerContract | null>(null);
    const [isContractSubPanelOpen, setIsContractSubPanelOpen] = useState(true);



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
    }
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
        const baseCrumb: Breadcrumb = { label: 'Sales & Clients', onClick: handleBackToModuleDashboard };
        
        if (activeSubView === 'customer-management') {
            const customerListCrumb: Breadcrumb = { label: 'Customer', onClick: handleBackToCustomerList };
            if (customerViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Customer' }]);
            } else if (customerViewState === 'detail' && selectedCustomer) {
                setBreadcrumbs([baseCrumb, customerListCrumb, { label: selectedCustomer.name }]);
            } else if (customerViewState === 'new-customer') {
                setBreadcrumbs([baseCrumb, customerListCrumb, { label: 'New Customer' }]);
            }
        } else if (activeSubView === 'service-quotes') {
            const quotationListCrumb: Breadcrumb = { label: 'Quotation', onClick: handleBackToQuotationList };
            if (quotationViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Quotation' }]);
            } else if (quotationViewState === 'detail') {
                 if (selectedQuotation) {
                    setBreadcrumbs([baseCrumb, quotationListCrumb, { label: selectedQuotation.clientName }]);
                 } else {
                    setBreadcrumbs([baseCrumb, quotationListCrumb, { label: 'New Quotation' }]);
                 }
            }
        } else if (activeSubView === 'customer-contracts') {
            const contractListCrumb: Breadcrumb = { label: 'Customer Contracts', onClick: handleBackToContractList };
            if (contractViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Customer Contracts' }]);
            } else if (contractViewState === 'detail') {
                 if (selectedContract) {
                    setBreadcrumbs([baseCrumb, contractListCrumb, { label: selectedContract.contractId }]);
                 } else {
                    setBreadcrumbs([baseCrumb, contractListCrumb, { label: 'New Customer Contract' }]);
                 }
            }
        } else {
            setBreadcrumbs([baseCrumb]);
        }
    }, [activeSubView, customerViewState, selectedCustomer, quotationViewState, selectedQuotation, contractViewState, selectedContract, setBreadcrumbs]);
    
    // Render
    if (activeSubView === 'customer-management') {
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

    if (activeSubView === 'service-quotes') {
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
    
    if (activeSubView === 'customer-contracts') {
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

    return <SalesClientsDashboard />;
};

export default SalesClientsView;
