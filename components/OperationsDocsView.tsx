import React, { useState, useEffect } from 'react';
import type { Breadcrumb, Shipment, PackingList, ShippingInstruction } from '../types';
import OperationsDashboard from './OperationsDashboard';
import ShipmentListView from './ShipmentListView';
import ShipmentDetailView from './ShipmentDetailView';
import DocumentHubView from './DocumentHubView';
import PackingListView from './PackingListView';
import PackingListDetailView from './PackingListDetailView';
import ShippingInstructionListView from './ShippingInstructionListView';
import ShippingInstructionDetailView from './ShippingInstructionDetailView';
import { SHIPMENTS_DATA, PACKING_LISTS_DATA, SHIPPING_INSTRUCTIONS_DATA } from '../constants';

interface OperationsDocsViewProps {
    activeSubView: string | null;
    setActiveView: (view: string) => void;
    setActiveSubView: (view: string | null) => void;
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const OperationsDocsView: React.FC<OperationsDocsViewProps> = ({ activeSubView, setActiveView, setActiveSubView, setBreadcrumbs, isSidebarOpen, setIsSidebarOpen }) => {
    
    // Internal state for shipment list/detail view
    const [shipmentViewState, setShipmentViewState] = useState<'list' | 'detail'>('list');
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [isListSubPanelOpen, setIsListSubPanelOpen] = useState(true);
    const [isDetailSubPanelOpen, setIsDetailSubPanelOpen] = useState(true);

    // Internal state for packing list
    const [packingLists, setPackingLists] = useState<PackingList[]>(PACKING_LISTS_DATA);
    const [packingListViewState, setPackingListViewState] = useState<'list' | 'detail'>('list');
    const [selectedPackingList, setSelectedPackingList] = useState<PackingList | null>(null);

    // Internal state for shipping instruction
    const [shippingInstructions, setShippingInstructions] = useState<ShippingInstruction[]>(SHIPPING_INSTRUCTIONS_DATA);
    const [siViewState, setSiViewState] = useState<'list' | 'detail'>('list');
    const [selectedSi, setSelectedSi] = useState<ShippingInstruction | null>(null);





    const handleSelectShipment = (shipmentId: string) => {
        const shipment = SHIPMENTS_DATA.find(s => s.id === shipmentId);
        if (shipment) {
            setSelectedShipment(shipment);
            setShipmentViewState('detail');
        }
    };

    const handleBackToShipmentList = () => {
        setSelectedShipment(null);
        setShipmentViewState('list');
    };
    
    const handleBackToModuleDashboard = () => {
        setActiveSubView('dashboard');
    };

    // Packing List Handlers
    const handleSelectPackingList = (packingListId: string) => {
        const packingList = packingLists.find(p => p.id === packingListId);
        if (packingList) {
            setSelectedPackingList(packingList);
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
        const isNew = !packingLists.some(pl => pl.id === savedPL.id);
        if (isNew) {
            setPackingLists(prev => [...prev, savedPL]);
        } else {
            setPackingLists(prev => prev.map(pl => (pl.id === savedPL.id ? savedPL : pl)));
        }
        setSelectedPackingList(savedPL);
    };

    // Shipping Instruction Handlers
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
        const isNew = !shippingInstructions.some(si => si.id === savedSi.id);
        if (isNew) {
            setShippingInstructions(prev => [...prev, savedSi]);
        } else {
            setShippingInstructions(prev => prev.map(si => (si.id === savedSi.id ? savedSi : si)));
        }
        setSelectedSi(savedSi);
    };


    // Reset internal state when main subview changes
    useEffect(() => {
        if (activeSubView !== 'shipments') {
            setShipmentViewState('list');
            setSelectedShipment(null);
        }
        if (activeSubView !== 'packing-lists') {
            setPackingListViewState('list');
            setSelectedPackingList(null);
        }
        if (activeSubView !== 'shipping-instructions') {
            setSiViewState('list');
            setSelectedSi(null);
        }
    }, [activeSubView]);


    // Breadcrumb management
    useEffect(() => {
        const baseCrumb: Breadcrumb = { label: 'Operations & Shipments', onClick: handleBackToModuleDashboard };
        
        const subViewMap: { [key: string]: string } = {
            'customs-declarations': 'Customs Declarations',
            'cargo-tracking': 'Cargo Tracking',
        };

        if (activeSubView === 'shipments') {
            const shipmentListCrumb: Breadcrumb = { label: 'Shipments', onClick: handleBackToShipmentList };
            if (shipmentViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Shipments' }]);
            } else if (selectedShipment) {
                setBreadcrumbs([baseCrumb, shipmentListCrumb, { label: selectedShipment.shipmentId }]);
            }
        } else if (activeSubView === 'packing-lists') {
            const packingListCrumb: Breadcrumb = { label: 'Packing Lists', onClick: handleBackToPackingList };
            if (packingListViewState === 'list') {
                setBreadcrumbs([baseCrumb, { label: 'Packing Lists' }]);
            } else if (selectedPackingList) {
                setBreadcrumbs([baseCrumb, packingListCrumb, { label: selectedPackingList.packingListNumber }]);
            } else {
                 setBreadcrumbs([baseCrumb, packingListCrumb, { label: 'New Packing List' }]);
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
        } else if (activeSubView && subViewMap[activeSubView]) {
            setBreadcrumbs([baseCrumb, { label: subViewMap[activeSubView] }]);
        } else {
            setBreadcrumbs([baseCrumb]); // Dashboard
        }
    }, [activeSubView, shipmentViewState, selectedShipment, packingListViewState, selectedPackingList, siViewState, selectedSi, setBreadcrumbs, setActiveSubView]);

    
    switch(activeSubView) {
        case 'shipments':
            if (shipmentViewState === 'detail' && selectedShipment) {
                return <ShipmentDetailView 
                            shipment={selectedShipment} 
                            onBack={handleBackToShipmentList}
                            isSubPanelOpen={isDetailSubPanelOpen}
                            toggleSubPanel={() => setIsDetailSubPanelOpen(!isDetailSubPanelOpen)}
                        />;
            }
            return <ShipmentListView 
                        onShipmentSelect={handleSelectShipment}
                        isSubPanelOpen={isListSubPanelOpen}
                        toggleSubPanel={() => setIsListSubPanelOpen(!isListSubPanelOpen)}
                    />;
        case 'packing-lists':
            if (packingListViewState === 'detail') {
                return <PackingListDetailView packingList={selectedPackingList} onBack={handleBackToPackingList} onSave={handleSavePackingList} />;
            }
            return <PackingListView packingLists={packingLists} onPackingListSelect={handleSelectPackingList} onNewPackingList={handleNewPackingList} />;
        case 'shipping-instructions':
            if (siViewState === 'detail') {
                return <ShippingInstructionDetailView shippingInstruction={selectedSi} onBack={handleBackToSiList} onSave={handleSaveSi} />;
            }
            return <ShippingInstructionListView shippingInstructions={shippingInstructions} onSiSelect={handleSelectSi} onNewSi={handleNewSi} />;
        case 'customs-declarations':
        case 'cargo-tracking':
            // Placeholder for other views
            return (
                <div className="rounded-lg border border-gray-200 bg-white p-8">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeSubView === 'customs-declarations' ? 'Customs Declarations' : 'Cargo Tracking'}
                    </h2>
                    <p className="mt-4 text-gray-600">Content for this section will be displayed here.</p>
                </div>
            );
        case 'dashboard':
        default:
            return <OperationsDashboard setActiveView={setActiveView} setActiveSubView={setActiveSubView} />;
    }
};

export default OperationsDocsView;