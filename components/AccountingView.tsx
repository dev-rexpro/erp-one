

import React from 'react';
import AccountingDashboard from './AccountingDashboard';
import PayablesView from './PayablesView';
import ReceivablesView from './ReceivablesView';
import FinancialReportsView from './FinancialReportsView';

interface AccountingViewProps {
    activeSubView: string | null;
}

const AccountingView: React.FC<AccountingViewProps> = ({ activeSubView }) => {
    switch(activeSubView) {
        case 'payables':
            return <PayablesView />;
        case 'receivables':
            return <ReceivablesView />;
        case 'financial-reports':
            return <FinancialReportsView />;
        case 'dashboard':
        default:
            return <AccountingDashboard />;
    }
};

export default AccountingView;
