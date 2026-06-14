import React, { useState, useEffect, useRef } from 'react';
import type { PackingList, PackingListItem, Customer } from '../types';
import { PACKING_LISTS_DATA, CUSTOMERS_DATA, PACKING_LIST_TEMPLATE_HTML, XIcon, DotsHorizontalIcon, RefreshIcon, PrinterIcon, ArrowUpRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, FileCodeIcon, ChevronDownIcon, AlignLeftIcon, AlignRightIcon } from '../constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface PackingListDetailViewProps {
    packingList: PackingList | null; // Null for new
    onBack: () => void;
    onSave: (packingList: PackingList) => void;
}

const getNextPackingListNumber = () => {
    return `PL${new Date().getFullYear()}${String(PACKING_LISTS_DATA.length + 21).padStart(4, '0')}`;
};

const newPackingListTemplate: PackingList = {
    id: String(Date.now()),
    packingListNumber: getNextPackingListNumber(),
    packingListDate: new Date().toISOString().split('T')[0],
    status: 'Draft',
    shipmentId: '',
    invoiceNumber: '',
    contractNumber: '',
    billToId: '',
    billToName: '',
    billToAddress1: '',
    billToAddress2: '',
    billToCountry: '',
    billToPhone: '',
    shipToName: '',
    shipToAddress1: '',
    shipToAddress2: '',
    shipToCountry: '',
    shipToPhone: '',
    orderDate: new Date().toISOString().split('T')[0],
    customerContact: '',
    items: [{ id: 1, itemNumber: '1', description: '', packageCount: 0, netWeight: 0, grossWeight: 0, packageText: '', quantity: '' }],
    totalNetWeight: 0,
    totalGrossWeight: 0,
    totalQuantity: 0,
    totalPackageText: '',
    comments: 'Backordered items will ship as they become available',
    quantityUnit: 'Kg'
};

const recalculatePackingList = (pl: PackingList): PackingList => {
    const totalQuantity = pl.items.reduce((acc, item) => {
        const qty = item.quantity === '' || isNaN(Number(item.quantity)) ? 0 : Number(item.quantity);
        return acc + qty;
    }, 0);

    let totalCount = 0;
    let commonUnit = 'Box';
    pl.items.forEach(item => {
        const text = item.packageText || '';
        const match = text.trim().match(/^([\d.,]+)\s*(.*)$/);
        if (match) {
            const num = parseFloat(match[1].replace(/,/g, ''));
            if (!isNaN(num)) {
                totalCount += num;
            }
            if (match[2].trim()) {
                commonUnit = match[2].trim();
            }
        } else if (text.trim() && !isNaN(parseFloat(text.trim()))) {
            const num = parseFloat(text.trim());
            if (!isNaN(num)) {
                totalCount += num;
            }
        }
    });
    const totalPackageText = totalCount > 0 ? `${totalCount} ${commonUnit}` : '';

    return {
        ...pl,
        totalQuantity,
        totalPackageText,
        totalNetWeight: pl.items.reduce((acc, item) => acc + (Number(item.netWeight) || 0), 0),
        totalGrossWeight: pl.items.reduce((acc, item) => acc + (Number(item.grossWeight) || 0), 0)
    };
};

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);

const PackingListDetailView: React.FC<PackingListDetailViewProps> = ({ packingList, onBack, onSave }) => {
    const isNew = !packingList;
    const [packingListData, setPackingListData] = useState<PackingList>(() => {
        const initial = packingList ? JSON.parse(JSON.stringify(packingList)) : newPackingListTemplate;
        initial.items = initial.items.map((item: any, idx: number) => ({
            ...item,
            id: item.id || Date.now() + idx,
            itemNumber: item.itemNumber || String(idx + 1),
            packageText: item.packageText !== undefined ? item.packageText : `${item.packageCount || 0} Box`,
            quantity: item.quantity !== undefined ? item.quantity : (item.netWeight || '')
        }));
        return recalculatePackingList(initial);
    });
    const [isPreview, setIsPreview] = useState(isNew ? false : true);
    
    // Read Company Settings for dynamic header logo/name
    const [companySettings] = useState(() => {
        try {
            const saved = localStorage.getItem('companySettings');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    
    // Dynamic Customers State
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        const cached = localStorage.getItem('CUSTOMERS_DATA');
        if (cached) {
            setCustomers(JSON.parse(cached));
        } else {
            setCustomers(CUSTOMERS_DATA);
        }
    }, []);
    
    const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    
    const [zoom, setZoom] = useState<'fit' | number>('fit');
    const [previewScale, setPreviewScale] = useState(1);
    const [isZoomDropdownOpen, setIsZoomDropdownOpen] = useState(false);
    const zoomDropdownRef = useRef<HTMLDivElement>(null);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
     
    const zoomOptions: { label: string; value: 'fit' | number }[] = [
        { label: 'Fit to View', value: 'fit' },
        { label: '100%', value: 1 },
        { label: '75%', value: 0.75 },
        { label: '50%', value: 0.5 },
        { label: '25%', value: 0.25 },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (zoomDropdownRef.current && !zoomDropdownRef.current.contains(event.target as Node)) {
                setIsZoomDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const calculateFitScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;

                const horizontalPadding = 64; // p-8
                const verticalPadding = 64; // p-8

                const availableWidth = containerWidth - horizontalPadding;
                const availableHeight = containerHeight - verticalPadding;

                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.visibility = 'hidden';
                document.body.appendChild(tempDiv);
                
                tempDiv.style.width = '210mm';
                const contentPixelWidth = tempDiv.offsetWidth;

                tempDiv.style.width = 'auto';
                tempDiv.style.height = '297mm';
                const contentPixelHeight = tempDiv.offsetHeight;
                
                document.body.removeChild(tempDiv);

                if (contentPixelWidth > 0 && contentPixelHeight > 0 && availableWidth > 0 && availableHeight > 0) {
                    const scaleX = availableWidth / contentPixelWidth;
                    const scaleY = availableHeight / contentPixelHeight;
                    return Math.min(scaleX, scaleY);
                }
            }
            return 1;
        };

        const handleResize = () => {
             if (zoom === 'fit') {
                setPreviewScale(calculateFitScale());
            }
        };

        if (zoom === 'fit') {
            setPreviewScale(calculateFitScale());
        } else {
            setPreviewScale(zoom);
        }

        window.addEventListener('resize', handleResize);
        const timer = setTimeout(handleResize, 50);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [zoom, isPreview, isPrintSettingsOpen]);

    const handleInputChange = (field: keyof PackingList, value: any) => {
        setPackingListData(prev => {
            const updated = { ...prev, [field]: value };
            return recalculatePackingList(updated);
        });
    };

    const handleItemChange = (id: number, field: keyof PackingListItem, value: any) => {
        setPackingListData(prev => {
            const updatedItems = prev.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            const updated = { ...prev, items: updatedItems };
            return recalculatePackingList(updated);
        });
    };

    const handleAddItem = () => {
        setPackingListData(prev => {
            const updatedItems = [...prev.items, { id: Date.now(), itemNumber: String(prev.items.length + 1), description: '', packageCount: 0, netWeight: 0, grossWeight: 0, packageText: '', quantity: '', unit: 'Kg' }];
            const updated = { ...prev, items: updatedItems };
            return recalculatePackingList(updated);
        });
    };

    const handleRemoveItem = (id: number) => {
        setPackingListData(prev => {
            const updatedItems = prev.items.filter(item => item.id !== id);
            const updated = { ...prev, items: updatedItems };
            return recalculatePackingList(updated);
        });
    };
    
    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        
        const cachedEmails = JSON.parse(localStorage.getItem('CUSTOMER_EMAILS') || '{}');
        const cachedPhones = JSON.parse(localStorage.getItem('CUSTOMER_PHONES') || '{}');
        const cachedAddresses = JSON.parse(localStorage.getItem('CUSTOMER_ADDRESSES') || '{}');

        if (customer) {
            setPackingListData(prev => {
                const updated = { 
                    ...prev, 
                    billToId: customerId, 
                    billToName: customer.name || '',
                    billToAddress1: cachedAddresses[customerId] || 'Ciwaru Indah Residence',
                    billToAddress2: customer.territory || 'Jawa Barat, Indonesia',
                    billToPhone: cachedPhones[customerId] || '+62...'
                };
                return recalculatePackingList(updated);
            });
        }
    };

    const handleSave = () => {
        onSave(packingListData);
        setIsPreview(true);
    };

    const generatePreviewHtml = () => {
        let html = PACKING_LIST_TEMPLATE_HTML;
        
        let headerHtml = `
            <div class="text-gray-800">
                <div class="text-2xl font-bold text-red-700">REXCorp.</div>
                <div class="font-bold text-lg mt-1">PT REXINDO ARUNA SEDAYA</div>
                <div class="text-sm mt-2 leading-tight">
                    Ciwaru Indah Residence Blok B5<br>
                    Sukamantri, Tamansari, Kab.Bogor 16610<br>
                    Jawa Barat, Indonesia<br>
                    Phone: +62 85723000060
                </div>
            </div>
        `;

        if (companySettings) {
            const isDefault = companySettings.name === 'REXCorp.';
            const displayName = isDefault ? 'PT REXINDO ARUNA SEDAYA' : companySettings.name;
            const formattedAddress = companySettings.address 
                ? companySettings.address.replace(/\n/g, '<br>') 
                : 'Ciwaru Indah Residence Blok B5<br>Sukamantri, Tamansari, Kab.Bogor 16610<br>Jawa Barat, Indonesia<br>Phone: +62 85723000060';

            if (companySettings.logo) {
                headerHtml = `
                    <div class="flex flex-col items-start gap-1 max-w-[350px]">
                        <img src="${companySettings.logo}" alt="${companySettings.name} Logo" class="max-h-11 max-w-[170px] mb-1 object-contain object-left" referrerPolicy="no-referrer" />
                        <div class="font-bold text-base text-gray-900 leading-tight">${displayName}</div>
                        <div class="text-xs text-gray-650 leading-tight mt-1">${formattedAddress}</div>
                    </div>
                `;
            } else {
                headerHtml = `
                    <div class="text-gray-800">
                        <div class="text-2xl font-bold text-red-700">${companySettings.name}</div>
                        <div class="font-bold text-lg mt-1">${displayName}</div>
                        <div class="text-sm mt-2 leading-tight text-gray-600">
                            ${formattedAddress}
                        </div>
                    </div>
                `;
            }
        }
        
        const itemRowsHtml = packingListData.items.map(item => `
            <tr>
                <td class="px-3 py-1.5 text-sm" style="border: 1px solid black;">${item.itemNumber}</td>
                <td class="px-3 py-1.5 text-sm" style="border: 1px solid black; font-weight: bold;">${item.description}</td>
                <td class="px-3 py-1.5 text-sm" style="border: 1px solid black;">${item.packageText || ''}</td>
                <td class="px-3 py-1.5 text-sm text-right font-medium" style="border: 1px solid black;">${item.quantity !== undefined && item.quantity !== '' ? Number(item.quantity).toLocaleString('en-US') : ''}</td>
            </tr>`).join('') || `<tr><td colspan="4" class="px-3 py-2 text-sm text-center text-gray-500" style="border: 1px solid black;">(No items)</td></tr>`;

        const replacements = {
            '{{companyHeaderHtml}}': headerHtml,
            '{{quantityUnit}}': packingListData.quantityUnit || 'Kg',
            '{{packingListNumber}}': packingListData.packingListNumber,
            '{{packingListDate}}': new Date(packingListData.packingListDate).toLocaleDateString('en-GB'),
            '{{billToName}}': packingListData.billToName || '',
            '{{billToAddress1}}': packingListData.billToAddress1 || '',
            '{{billToAddress2}}': packingListData.billToAddress2 || '',
            '{{billToCountry}}': packingListData.billToCountry || '',
            '{{billToPhone}}': packingListData.billToPhone || '',
            '{{shipToName}}': packingListData.shipToName || '',
            '{{shipToAddress1}}': packingListData.shipToAddress1 || '',
            '{{shipToAddress2}}': packingListData.shipToAddress2 || '',
            '{{shipToCountry}}': packingListData.shipToCountry || '',
            '{{shipToPhone}}': packingListData.shipToPhone || '',
            '{{orderDate}}': new Date(packingListData.orderDate).toLocaleDateString('en-GB'),
            '{{contractNumber}}': packingListData.contractNumber || '-',
            '{{invoiceNumber}}': packingListData.invoiceNumber || '',
            '{{customerContact}}': packingListData.customerContact || '',
            '{{itemRows}}': itemRowsHtml,
            '{{totalPackageText}}': packingListData.totalPackageText || '',
            '{{totalQuantity}}': packingListData.totalQuantity !== undefined ? Number(packingListData.totalQuantity).toLocaleString('en-US') : '0',
            '{{comments}}': (packingListData.comments || '').replace(/\n/g, '<br>'),
        };
        
        Object.entries(replacements).forEach(([key, value]) => {
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            html = html.replace(new RegExp(escapedKey, 'g'), String(value));
        });
        
        return html;
    };
    
    const handlePrint = () => {
        const html = generatePreviewHtml();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            // Wait slightly for resources to initialize before calling print
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 600);
        } else {
            // Fallback to iframe printing if popups are blocked
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            }
        }
    };

    const handleRefresh = () => {
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.srcDoc = generatePreviewHtml();
        }
    };
    
    const handleFullPage = () => {
        const html = generatePreviewHtml();
        const fullPageHtml = html.replace('overflow: hidden;', 'overflow: auto;');
        const blob = new Blob([fullPageHtml], { type: 'text/html' });
        window.open(URL.createObjectURL(blob), '_blank');
    };

    const editorView = (
        <div className="space-y-6">
            {/* Header fields */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Document Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Packing List #"><input type="text" value={packingListData.packingListNumber} onChange={e => handleInputChange('packingListNumber', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"/></FormField>
                    <FormField label="Status">
                        <Select value={packingListData.status} onValueChange={val => handleInputChange('status', val)}>
                            <SelectTrigger className="w-full p-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                    <FormField label="Date"><input type="date" value={packingListData.packingListDate} onChange={e => handleInputChange('packingListDate', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></FormField>
                </div>
            </div>

            {/* Trade & Document Reference */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Reference Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FormField label="Order Date"><input type="date" value={packingListData.orderDate} onChange={e => handleInputChange('orderDate', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></FormField>
                    <FormField label="Contract #"><input type="text" value={packingListData.contractNumber} onChange={e => handleInputChange('contractNumber', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="-"/></FormField>
                    <FormField label="Invoice #"><input type="text" value={packingListData.invoiceNumber} onChange={e => handleInputChange('invoiceNumber', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="IN..."/></FormField>
                    <FormField label="Customer Contact"><input type="text" value={packingListData.customerContact} onChange={e => handleInputChange('customerContact', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Mr. Zhang"/></FormField>
                    <FormField label="Qty Unit">
                        <Select value={packingListData.quantityUnit || 'Kg'} onValueChange={val => handleInputChange('quantityUnit', val)}>
                            <SelectTrigger className="w-full p-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kg">Kg</SelectItem>
                                <SelectItem value="Pcs">Pcs</SelectItem>
                                <SelectItem value="g">g</SelectItem>
                                <SelectItem value="Box">Box</SelectItem>
                                <SelectItem value="Ltr">Ltr</SelectItem>
                                <SelectItem value="Ctn">Ctn</SelectItem>
                                <SelectItem value="Unit">Unit</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>
            </div>

            {/* Parties */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bill To */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Bill To</h3>
                        </div>
                        <FormField label="Customer Select">
                            <Select value={packingListData.billToId || ''} onValueChange={val => handleCustomerChange(val)}>
                                <SelectTrigger className="w-full p-2">
                                    <SelectValue placeholder="Select Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormField label="Name"><input value={packingListData.billToName} onChange={e => handleInputChange('billToName', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                        <FormField label="Address"><input value={packingListData.billToAddress1} onChange={e => handleInputChange('billToAddress1', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Country"><input value={packingListData.billToCountry} onChange={e => handleInputChange('billToCountry', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                            <FormField label="Phone"><input value={packingListData.billToPhone} onChange={e => handleInputChange('billToPhone', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                        </div>
                    </div>

                    {/* Ship To */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Ship To</h3>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPackingListData(prev => ({
                                        ...prev,
                                        shipToName: prev.billToName,
                                        shipToAddress1: prev.billToAddress1,
                                        shipToCountry: prev.billToCountry,
                                        shipToPhone: prev.billToPhone
                                    }));
                                }}
                                className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition border font-medium text-gray-700 dark:text-gray-300"
                            >
                                Copy same as Bill To
                            </button>
                        </div>
                        <FormField label="Name"><input value={packingListData.shipToName} onChange={e => handleInputChange('shipToName', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                        <FormField label="Address"><input value={packingListData.shipToAddress1} onChange={e => handleInputChange('shipToAddress1', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Country"><input value={packingListData.shipToCountry} onChange={e => handleInputChange('shipToCountry', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                            <FormField label="Phone"><input value={packingListData.shipToPhone} onChange={e => handleInputChange('shipToPhone', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Line Items</h3>
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">
                        <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Quantity Unit (UOM):</span>
                        <Select value={packingListData.quantityUnit || 'Kg'} onValueChange={val => handleInputChange('quantityUnit', val)}>
                            <SelectTrigger className="p-1 text-sm w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Kg">Kg</SelectItem>
                                <SelectItem value="Pcs">Pcs</SelectItem>
                                <SelectItem value="g">g</SelectItem>
                                <SelectItem value="Box">Box</SelectItem>
                                <SelectItem value="Ltr">Ltr</SelectItem>
                                <SelectItem value="Ctn">Ctn</SelectItem>
                                <SelectItem value="Unit">Unit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-left">
                        <tr>
                            <th className="p-2 font-medium text-gray-600 dark:text-gray-300 w-20">Item #</th>
                            <th className="p-2 font-medium text-gray-600 dark:text-gray-300">Description</th>
                            <th className="p-2 font-medium text-gray-600 dark:text-gray-300 w-44">Package</th>
                            <th className="p-2 font-medium text-gray-600 dark:text-gray-300 w-36 text-right">Quantity ({packingListData.quantityUnit || 'Kg'})</th>
                            <th className="p-2 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {packingListData.items.map(item => (
                            <tr key={item.id} className="border-b dark:border-gray-700">
                                <td className="p-1"><input value={item.itemNumber} onChange={e => handleItemChange(item.id, 'itemNumber', e.target.value)} className="w-full p-1.5 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></td>
                                <td className="p-1"><input value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="w-full p-1.5 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. Bucephalandra sp"/></td>
                                <td className="p-1"><input value={item.packageText || ''} onChange={e => handleItemChange(item.id, 'packageText', e.target.value)} className="w-full p-1.5 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 2 Box"/></td>
                                <td className="p-1"><input type="number" value={item.quantity !== undefined ? item.quantity : ''} onChange={e => { const val = e.target.value; handleItemChange(item.id, 'quantity', val === '' ? '' : parseFloat(val)); }} className="w-full p-1.5 border rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 1500"/></td>
                                <td className="p-1 text-center"><button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500"><XIcon className="h-4 w-4"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold">
                            <td colSpan={2} className="p-2 text-right">Total:</td>
                            <td className="p-2">{packingListData.totalPackageText || ''}</td>
                            <td className="p-2 text-right text-base font-bold text-red-600 dark:text-red-400">{(packingListData.totalQuantity || 0).toLocaleString()}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                <button onClick={handleAddItem} className="mt-4 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 font-medium">+ Add Item Row</button>
            </div>

            {/* Comments block */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <FormField label="Comments / Notes on Packing List">
                    <textarea 
                        value={packingListData.comments} 
                        onChange={e => handleInputChange('comments', e.target.value)} 
                        className="w-full p-2 border rounded-md h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        placeholder="e.g. Backordered items will ship as they become available"
                    />
                </FormField>
            </div>
        </div>
    );
    
    const previewHeader = (
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center space-x-4">
                <button
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={() => setIsPrintSettingsOpen(!isPrintSettingsOpen)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? (
                    isPrintSettingsOpen ? (
                      <ChevronDoubleLeftIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDoubleRightIcon className="h-5 w-5" />
                    )
                  ) : isPrintSettingsOpen ? (
                    <AlignLeftIcon className="h-5 w-5" />
                  ) : (
                    <AlignRightIcon className="h-5 w-5" />
                  )}
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{packingListData.packingListNumber}</h1>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => setIsPreview(false)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Edit</button>
                
                <div className="relative" ref={zoomDropdownRef}>
                    <button onClick={() => setIsZoomDropdownOpen(prev => !prev)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center space-x-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                        <span>{zoom === 'fit' ? 'Fit to View' : `${zoom * 100}%`}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {isZoomDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600">
                            <div className="py-1">
                                {zoomOptions.map(option => (
                                    <button
                                        key={option.label}
                                        onClick={() => { setZoom(option.value); setIsZoomDropdownOpen(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleFullPage} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center space-x-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"><ArrowUpRightIcon /><span>Full Page</span></button>
                <button onClick={handlePrint} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center space-x-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"><FileCodeIcon className="h-4 w-4" /><span>PDF</span></button>
                <button onClick={handleRefresh} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center space-x-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"><RefreshIcon className="h-4 w-4" /><span>Refresh</span></button>
                <button className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"><DotsHorizontalIcon className="h-4 w-4"/></button>
                <button onClick={handlePrint} className="px-4 py-1.5 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 flex items-center space-x-2 dark:bg-blue-600 dark:hover:bg-blue-700"><PrinterIcon className="h-4 w-4"/><span>Print</span></button>
            </div>
        </div>
    );
    
    const editorHeader = (
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center space-x-4"><h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isNew ? 'New Packing List' : `${packingList?.packingListNumber}`}</h1></div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsPreview(true)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Preview</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">Save</button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col -m-6">
            {isPreview ? previewHeader : editorHeader}
            <div className="flex-1 flex items-start p-6 gap-6">
                {isPreview ? (
                    <>
                        {isPrintSettingsOpen && (
                            <aside className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                               <div className="space-y-4">
                                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Print Settings</h3>
                                    <FormField label="Print Format"><input placeholder="Standard Packing List" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" /></FormField>
                                    <FormField label="Language"><input value="en" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" readOnly /></FormField>
                                    <FormField label="Letter Head"><input value="REXCorp." className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" readOnly/></FormField>
                                    <div className="space-y-2 pt-4 border-t mt-2 dark:border-gray-700">
                                        <label className="flex items-center space-x-2"><Checkbox defaultChecked className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /> <span className="text-sm text-gray-700 dark:text-gray-300">Show Item # Column</span></label>
                                        <label className="flex items-center space-x-2"><Checkbox defaultChecked className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /> <span className="text-sm text-gray-700 dark:text-gray-300">Include Weight Totals</span></label>
                                        <label className="flex items-center space-x-2"><Checkbox defaultChecked className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /> <span className="text-sm text-gray-700 dark:text-gray-300">Show Comments Section</span></label>
                                    </div>
                                </div>
                            </aside>
                        )}
                        <main ref={containerRef} className="flex-1 flex flex-col rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-900/50">
                            <div className="flex-1 flex justify-center items-start py-8 px-8 overflow-hidden">
                                <div className="bg-white shadow-lg" style={{ width: '210mm', transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
                                    <iframe ref={iframeRef} srcDoc={generatePreviewHtml()} className="w-full border-0" style={{ height: '297mm' }} title="Packing List Preview" />
                                </div>
                            </div>
                        </main>
                    </>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar">{editorView}</div>
                )}
            </div>
        </div>
    );
};

export default PackingListDetailView;