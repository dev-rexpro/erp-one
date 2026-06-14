import React, { useState, useEffect, useRef } from 'react';
import type { ShippingInstruction } from '../types';
import { SHIPPING_INSTRUCTIONS_DATA, SHIPPING_INSTRUCTION_TEMPLATE_HTML, XIcon, DotsHorizontalIcon, RefreshIcon, PrinterIcon, ArrowUpRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, FileCodeIcon, ChevronDownIcon, AlignLeftIcon, AlignRightIcon } from '../constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface ShippingInstructionDetailViewProps {
    shippingInstruction: ShippingInstruction | null; // Null for new
    onBack: () => void;
    onSave: (si: ShippingInstruction) => void;
}

const getNextSiNumber = () => {
    if (SHIPPING_INSTRUCTIONS_DATA.length === 0) {
        return 'SI-2024-001';
    }
    const lastSI = SHIPPING_INSTRUCTIONS_DATA.reduce((latest, si) => {
        const latestNum = parseInt(latest.shippingInstructionNumber.split('-')[2], 10);
        const currentNum = parseInt(si.shippingInstructionNumber.split('-')[2], 10);
        return currentNum > latestNum ? si : latest;
    });
    const nextNum = parseInt(lastSI.shippingInstructionNumber.split('-')[2], 10) + 1;
    return `SI-2024-${String(nextNum).padStart(3, '0')}`;
};

const newSiTemplate: ShippingInstruction = {
    id: String(Date.now()),
    shippingInstructionNumber: getNextSiNumber(),
    shippingInstructionDate: new Date().toISOString().split('T')[0],
    status: 'Draft',
    packingListId: '',
    invoiceId: '',
    toParty: '',
    emklParty: '',
    shipperName: 'PT REXINDO ARUNA SEDAYA',
    shipperAddress1: 'Ciwaru Indah Residence Blok B5',
    shipperAddress2: 'Sukamantri, Tamansari',
    shipperAddress3: 'Kab.Bogor 16610, Indonesia',
    shipperPhone: '+62 85723000060',
    consigneeName: '',
    consigneeAddress1: '',
    consigneeAddress2: '',
    consigneeAddress3: '',
    consigneePhone: '',
    notifyPartyName: '',
    notifyPartyEmail: '',
    goodsDescription: '',
    grossWeight: '',
    portOfLanding: '',
    portOfDelivery: '',
    partyContainer: '',
    freightTerm: 'FREIGHT PREPAID',
    freightType: 'CY/CY',
    insuranceStatus: 'By Shipper',
    dateOfStuffing: new Date().toISOString().split('T')[0],
    placeOfStuffing: "Shipper's Warehouse, Bogor",
    remarksText: 'Please issue 3/3 Original B/L.\nAll goods are of Indonesian origin.'
};

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);

const ShippingInstructionDetailView: React.FC<ShippingInstructionDetailViewProps> = ({ shippingInstruction, onBack, onSave }) => {
    const isNew = !shippingInstruction;
    const [siData, setSiData] = useState<ShippingInstruction>(shippingInstruction ? JSON.parse(JSON.stringify(shippingInstruction)) : newSiTemplate);
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
    
    const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    
    const [zoom, setZoom] = useState<'fit' | number>('fit');
    const [previewScale, setPreviewScale] = useState(1);
    const [isZoomDropdownOpen, setIsZoomDropdownOpen] = useState(false);
    const zoomDropdownRef = useRef<HTMLDivElement>(null);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const zoomOptions: { label: string; value: 'fit' | number }[] = [
        { label: 'Fit to Width', value: 'fit' },
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

                const horizontalPadding = 64; // px-8
                const verticalPadding = 64; // py-8

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

    const handleInputChange = (field: keyof ShippingInstruction, value: any) => {
        setSiData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(siData);
        setIsPreview(true); // Switch to preview after saving
    };
    
    const generatePreviewHtml = () => {
        let html = SHIPPING_INSTRUCTION_TEMPLATE_HTML;
        
        let headerHtml = `
            <div class="text-gray-800">
                <div class="text-xl font-bold text-red-700">REXCorp.</div>
                <div class="font-bold text-base mt-1">PT REXINDO ARUNA SEDAYA</div>
                <div class="text-xs mt-1 leading-tight">
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
                        <div class="text-[22px] font-bold text-red-700">${companySettings.name}</div>
                        <div class="font-bold text-base mt-1">${displayName}</div>
                        <div class="text-xs mt-2 leading-tight text-gray-600">
                            ${formattedAddress}
                        </div>
                    </div>
                `;
            }
        }
        
        const replacements: { [key: string]: string } = {
            '{{companyHeaderHtml}}': headerHtml,
            '{{shippingInstructionNumber}}': siData.shippingInstructionNumber,
            '{{shippingInstructionDate}}': new Date(siData.shippingInstructionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            '{{toParty}}': siData.toParty,
            '{{emklParty}}': siData.emklParty,
            '{{shipperName}}': siData.shipperName,
            '{{shipperAddress1}}': siData.shipperAddress1,
            '{{shipperAddress2}}': siData.shipperAddress2,
            '{{shipperAddress3}}': siData.shipperAddress3,
            '{{shipperPhone}}': siData.shipperPhone,
            '{{consigneeName}}': siData.consigneeName,
            '{{consigneeAddress1}}': siData.consigneeAddress1,
            '{{consigneeAddress2}}': siData.consigneeAddress2,
            '{{consigneeAddress3}}': siData.consigneeAddress3,
            '{{consigneePhone}}': siData.consigneePhone,
            '{{notifyPartyName}}': siData.notifyPartyName,
            '{{notifyPartyEmail}}': siData.notifyPartyEmail,
            '{{goodsDescription}}': siData.goodsDescription,
            '{{grossWeight}}': siData.grossWeight,
            '{{portOfLanding}}': siData.portOfLanding,
            '{{portOfDelivery}}': siData.portOfDelivery,
            '{{partyContainer}}': siData.partyContainer,
            '{{freightTerm}}': siData.freightTerm,
            '{{freightType}}': siData.freightType,
            '{{insuranceStatus}}': siData.insuranceStatus,
            '{{dateOfStuffing}}': new Date(siData.dateOfStuffing).toLocaleDateString('en-GB'),
            '{{placeOfStuffing}}': siData.placeOfStuffing,
            '{{remarksText}}': siData.remarksText.replace(/\n/g, '<br>'),
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField label="SI #"><input type="text" value={siData.shippingInstructionNumber} onChange={e => handleInputChange('shippingInstructionNumber', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"/></FormField>
                    <FormField label="Status">
                        <Select value={siData.status} onValueChange={val => handleInputChange('status', val)}>
                            <SelectTrigger className="w-full p-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Sent">Sent</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                    <FormField label="Date"><input type="date" value={siData.shippingInstructionDate} onChange={e => handleInputChange('shippingInstructionDate', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></FormField>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Parties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><FormField label="To (Forwarder)"><input value={siData.toParty} onChange={e => handleInputChange('toParty', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="EMKL"><input value={siData.emklParty} onChange={e => handleInputChange('emklParty', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField></div>
                    <div className="space-y-3"><FormField label="Notify Party Name"><input value={siData.notifyPartyName} onChange={e => handleInputChange('notifyPartyName', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Notify Party Email"><input value={siData.notifyPartyEmail} onChange={e => handleInputChange('notifyPartyEmail', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField></div>
                    <div className="space-y-3"><h4 className="font-medium text-gray-700 dark:text-gray-300">Shipper</h4><FormField label="Name"><input value={siData.shipperName} onChange={e => handleInputChange('shipperName', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"/></FormField><FormField label="Address"><textarea value={`${siData.shipperAddress1}\n${siData.shipperAddress2}\n${siData.shipperAddress3}`} rows={3} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" readOnly/></FormField></div>
                    <div className="space-y-3"><h4 className="font-medium text-gray-700 dark:text-gray-300">Consignee</h4><FormField label="Name"><input value={siData.consigneeName} onChange={e => handleInputChange('consigneeName', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></FormField><FormField label="Address 1"><input value={siData.consigneeAddress1} onChange={e => handleInputChange('consigneeAddress1', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Address 2"><input value={siData.consigneeAddress2} onChange={e => handleInputChange('consigneeAddress2', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Address 3"><input value={siData.consigneeAddress3} onChange={e => handleInputChange('consigneeAddress3', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Phone"><input value={siData.consigneePhone} onChange={e => handleInputChange('consigneePhone', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField></div>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Cargo & Route Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField label="Description of Goods"><input value={siData.goodsDescription} onChange={e => handleInputChange('goodsDescription', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Gross Weight"><input value={siData.grossWeight} onChange={e => handleInputChange('grossWeight', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Port of Landing"><input value={siData.portOfLanding} onChange={e => handleInputChange('portOfLanding', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Port of Delivery"><input value={siData.portOfDelivery} onChange={e => handleInputChange('portOfDelivery', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Party (Container)"><input value={siData.partyContainer} onChange={e => handleInputChange('partyContainer', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Freight Term"><input value={siData.freightTerm} onChange={e => handleInputChange('freightTerm', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Freight Type"><input value={siData.freightType} onChange={e => handleInputChange('freightType', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Insurance"><input value={siData.insuranceStatus} onChange={e => handleInputChange('insuranceStatus', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Date of Stuffing"><input type="date" value={siData.dateOfStuffing} onChange={e => handleInputChange('dateOfStuffing', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                    <FormField label="Place of Stuffing"><input value={siData.placeOfStuffing} onChange={e => handleInputChange('placeOfStuffing', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Remarks</h3>
                <textarea value={siData.remarksText} onChange={e => handleInputChange('remarksText', e.target.value)} className="w-full p-2 border rounded-md h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{siData.shippingInstructionNumber}</h1>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => setIsPreview(false)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Edit</button>
                
                <div className="relative" ref={zoomDropdownRef}>
                    <button onClick={() => setIsZoomDropdownOpen(prev => !prev)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center space-x-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                        <span>{zoom === 'fit' ? 'Fit Width' : `${zoom * 100}%`}</span>
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
                <button onClick={handlePrint} className="px-4 py-1.5 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 flex items-center space-x-2 dark:bg-gray-900 dark:hover:bg-gray-800"><PrinterIcon className="h-4 w-4"/><span>Print</span></button>
            </div>
        </div>
    );
    
    const editorHeader = (
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isNew ? 'New Shipping Instruction' : `${shippingInstruction?.shippingInstructionNumber}`}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsPreview(true)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Preview</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800">Save</button>
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
                                    <FormField label="Print Format"><input placeholder="Standard" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" /></FormField>
                                    <FormField label="Language"><input value="en" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" readOnly /></FormField>
                                    <FormField label="Letter Head"><input value="REXCorp." className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" readOnly/></FormField>
                                    <div className="space-y-2 pt-4 border-t dark:border-gray-700 mt-2">
                                        <label className="flex items-center space-x-2"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /> <span className="text-sm text-gray-700 dark:text-gray-300">Include Stamp Placeholder</span></label>
                                        <label className="flex items-center space-x-2"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /> <span className="text-sm text-gray-700 dark:text-gray-300">Compact Party Details</span></label>
                                        <label className="flex items-center space-x-2"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600" /> <span className="text-sm text-gray-700 dark:text-gray-300">Show Linked Documents</span></label>
                                    </div>
                                </div>
                            </aside>
                        )}
                        <main ref={containerRef} className="flex-1 flex flex-col rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-900/50">
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-center py-8 px-8">
                                    <div className="bg-white shadow-lg" style={{ width: '210mm', transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
                                        <iframe ref={iframeRef} srcDoc={generatePreviewHtml()} className="w-full border-0" style={{ height: '297mm' }} title="SI Preview" />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       {editorView}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingInstructionDetailView;