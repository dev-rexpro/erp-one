
import React, { useState, useEffect } from 'react';
import AccountingDashboard from './AccountingDashboard';
import PayablesView from './PayablesView';
import ReceivablesView from './ReceivablesView';
import FinancialReportsView from './FinancialReportsView';
import ClientInvoicingListView from './ClientInvoicingListView';
import ClientInvoiceDetailView from './ClientInvoiceDetailView';
import type { Invoice, Breadcrumb } from '../types';
import { INVOICES_DATA } from '../constants';

interface FinanceAccountingViewProps {
    activeSubView: string | null;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const FinanceAccountingView: React.FC<FinanceAccountingViewProps> = ({ activeSubView, setActiveSubView, setBreadcrumbs, setIsSidebarOpen }) => {
    
    // State for invoicing sub-module
    const [invoices, setInvoices] = useState<Invoice[]>(INVOICES_DATA);
    const [invoiceViewState, setInvoiceViewState] = useState<'list' | 'detail'>('list');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);



    // Handlers for navigating within the invoicing module
    const handleSelectInvoice = (invoiceId: string) => {
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

    const handleBackToInvoiceList = () => {
        setSelectedInvoice(null);
        setInvoiceViewState('list');
    };
    
    const handleSaveInvoice = (savedInvoice: Invoice) => {
        const isNew = !invoices.some(inv => inv.id === savedInvoice.id);
        if (isNew) {
            setInvoices(prev => [...prev, savedInvoice]);
        } else {
            setInvoices(prev => prev.map(inv => inv.id === savedInvoice.id ? savedInvoice : inv));
        }
        setSelectedInvoice(savedInvoice);
    };

    // Reset internal state when main subview changes
    useEffect(() => {
        if (activeSubView !== 'client-invoicing') {
            setInvoiceViewState('list');
            setSelectedInvoice(null);
        }
    }, [activeSubView]);

    // Breadcrumb management
    useEffect(() => {
        const baseCrumb: Breadcrumb = { label: 'Finance & Accounting', onClick: () => setActiveSubView('dashboard') };
        
        const subViewMap: { [key: string]: string } = {
            'accounts-receivable': 'Accounts Receivable',
            'vendor-bills': 'Vendor Bills',
            'financial-reports': 'Financial Reports',
        };

        if (activeSubView === 'client-invoicing') {
            const invoiceListCrumb: Breadcrumb = { label: 'Client Invoicing', onClick: handleBackToInvoiceList };
            if (invoiceViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Client Invoicing' }]);
            } else if (selectedInvoice) {
                setBreadcrumbs([baseCrumb, invoiceListCrumb, { label: selectedInvoice.invoiceNumber }]);
            } else {
                 setBreadcrumbs([baseCrumb, invoiceListCrumb, { label: 'New Invoice' }]);
            }
        } else if (activeSubView && subViewMap[activeSubView]) {
            setBreadcrumbs([baseCrumb, { label: subViewMap[activeSubView] }]);
        } else {
            setBreadcrumbs([baseCrumb]);
        }
    }, [activeSubView, invoiceViewState, selectedInvoice, setBreadcrumbs, setActiveSubView]);

    // Render logic based on the active sub-view
    switch(activeSubView) {
        case 'client-invoicing':
            if (invoiceViewState === 'detail') {
                return <ClientInvoiceDetailView invoice={selectedInvoice} onBack={handleBackToInvoiceList} onSave={handleSaveInvoice} />;
            }
            return <ClientInvoicingListView invoices={invoices} onInvoiceSelect={handleSelectInvoice} onNewInvoice={handleNewInvoice} />;
        case 'vendor-bills':
            return <PayablesView />;
        case 'accounts-receivable':
            return <ReceivablesView />;
        case 'financial-reports':
            return <FinancialReportsView />;
        case 'dashboard':
        default:
            return <AccountingDashboard />;
    }
};

export default FinanceAccountingView;