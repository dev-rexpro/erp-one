
import React from 'react';

interface VendorsPartnersViewProps {
    activeSubView: string | null;
}

const VendorsPartnersView: React.FC<VendorsPartnersViewProps> = ({ activeSubView }) => {
    const getTitle = () => {
        switch(activeSubView) {
            case 'partner-directory': return 'Partner Directory';
            case 'partner-contracts': return 'Partner Contract Management';
            case 'vendor-bill-payments': return 'Vendor Bill Payments';
            default: return 'Partners & Vendors Dashboard';
        }
    };
    
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{getTitle()}</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Content for this section will be displayed here. Please select a specific item from the sidebar to view its details.</p>
        </div>
    );
};

export default VendorsPartnersView;