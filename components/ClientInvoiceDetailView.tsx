import React, { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { Invoice, InvoiceItem } from '../types';
import { INVOICES_DATA, CUSTOMERS_DATA, XIcon, DotsHorizontalIcon, RefreshIcon, PrinterIcon, ArrowUpRightIcon, MenuIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, FileCodeIcon, ChevronDownIcon } from '../constants';

const INVOICE_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{invoiceNumber}}</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }
        .invoice-page {
            width: 210mm; /* A4 width */
            height: 297mm; /* A4 height */
            min-height: 297mm; /* A4 height */
            max-height: 297mm; /* A4 height */
            margin: 0 auto;
            padding: 10mm 15mm; /* Balanced padding */
            box-sizing: border-box;
            background-color: #fff;
            position: relative; /* Needed for absolute positioning of footer */
            display: flex; /* Use flexbox for vertical alignment */
            flex-direction: column; /* Arrange content in a column */
            overflow: hidden;
            page-break-after: avoid;
            page-break-before: avoid;
            page-break-inside: avoid;
        }
        .header-red-bar {
            background-color: #c00000;
            color: white;
            padding: 6px 12px;
            font-weight: bold;
            font-size: 0.85rem;
        }
        .table-header-red {
            background-color: #c00000;
            color: white;
            font-weight: bold;
        }
        .invoice-details-box {
            border: 1px solid #c00000;
            padding: 3px 8px; /* Adjusted padding to be tighter */
            font-size: 0.8rem; /* Adjusted font size for details */
            display: grid;
            grid-template-columns: 1fr 1.5fr; /* Adjust column width for labels and values */
            gap: 2px; /* Tighter gap */
        }
        .invoice-details-box span {
            padding: 1px 0;
        }
        .invoice-details-box .label {
            font-weight: bold;
            color: #555;
        }
        .invoice-details-box .value {
            font-weight: bold;
            color: #333;
        }
        .invoice-table {
            border-collapse: collapse; /* Make borders collapse to single lines */
            width: 100%;
        }
        .invoice-table th, .invoice-table td {
            border: 1px solid #e2e8f0; /* All cells have a light grey border */
            padding: 6px 8px; /* Tighter padding */
            text-align: left; /* Align text to the left */
        }
        .footer-content {
            margin-top: auto; /* Pushes content to the bottom */
            padding-top: 10px; /* Adjust as needed for spacing from main content */
        }
        @media print {
            body { background: white; }
            .invoice-page { margin: 0; box-shadow: none; }
        }
    </style>
</head>
<body class="bg-gray-100">

    <div class="invoice-page">
        <!-- Header Section -->
        <div class="flex justify-between items-start mb-4">
            {{companyHeaderHtml}}
            <div class="text-right">
                <div class="text-3xl font-bold text-red-700 mb-1">INVOICE</div>
                <div class="invoice-details-box">
                    <span class="label">DATE</span><span class="value">{{invoiceDate}}</span>
                    <span class="label">INVOICE #</span><span class="value">{{invoiceNumber}}</span>
                    <span class="label">CONTRACT #</span><span class="value">{{contractNumber}}</span>
                </div>
            </div>
        </div>

        <!-- Billed To & Trade Section -->
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="flex flex-col">
                <div class="header-red-bar mb-1 rounded-t-md">BILLED TO</div>
                <div class="border border-gray-300 p-2.5 text-xs leading-tight rounded-b-md flex-grow">
                    <div class="font-bold text-sm mb-0.5">{{billedToName}}</div>
                    <div>{{billedToAddress1}}</div>
                    <div>{{billedToCountry}}</div>
                    <div>{{billedToPhone}}</div>
                </div>
            </div>

            <div class="flex flex-col">
                <div class="header-red-bar mb-1 rounded-t-md">TRADE</div>
                <div class="border border-gray-300 p-2.5 text-xs rounded-b-md flex-grow leading-tight">
                    <div class="grid grid-cols-2 gap-y-1">
                        <span class="font-bold">Origin</span><span class="text-gray-700">{{origin}}</span>
                        <span class="font-bold">Destination</span><span class="text-gray-700">{{destination}}</span>
                        <span class="font-bold">Terms of Trade</span><span class="text-gray-700">{{termsOfTrade}}</span>
                        <span class="font-bold">Payment</span><span class="text-gray-700">{{payment}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="invoice-table mb-4 rounded-md table-fixed">
            <thead>
                <tr>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[40%]">Description</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[17%]">Qty ({{quantityUnit}})</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[15%]">Unit Price ($)</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[13%]">Taxed</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[15%]">Amount ($)</th>
                </tr>
            </thead>
            <tbody>
                {{itemRows}}
            </tbody>
        </table>

        <!-- Summary Totals -->
        <div class="flex justify-end mb-4">
            <div class="w-1/2 grid grid-cols-2 gap-y-0.5 text-xs">
                <span class="font-bold text-gray-800 col-span-1 text-right pr-4">Subtotal</span><span class="text-right text-gray-700 col-span-1">{{subtotal}}</span>
                <span class="font-bold text-gray-800 col-span-1 text-right pr-4">Taxable</span><span class="text-right text-gray-700 col-span-1">{{taxable}}</span>
                <span class="font-bold text-gray-800 col-span-1 text-right pr-4">Tax rate</span><span class="text-right text-gray-700 col-span-1">{{taxRate}}</span>
                <span class="font-bold text-gray-800 col-span-1 text-right pr-4">Tax due</span><span class="text-right text-gray-700 col-span-1">{{taxDue}}</span>
                <span class="font-bold text-gray-800 col-span-1 text-right pr-4">Other</span><span class="text-right text-gray-700 col-span-1 pb-1">{{otherCharges}}</span>
                <div class="col-span-2 flex justify-end">
                    <div class="w-3/4 border-t border-b-2 border-black pt-0.5 mb-0.5"></div>
                </div>
                <span class="font-bold text-black text-lg col-span-1 text-right pr-4">TOTAL</span><span class="font-bold text-black text-lg text-right col-span-1">{{totalAmount}}</span>
            </div>
        </div>

        <!-- Other Comments -->
        <div class="header-red-bar mb-1 rounded-t-md">OTHER COMMENTS</div>
        <div class="border border-gray-300 p-2.5 text-xs leading-tight mb-4 rounded-b-md">
            {{otherComments}}
        </div>

        <!-- Payment Info (moved here) -->
        <div class="text-xs leading-tight text-gray-700 mb-4">
            <div class="italic">Make all checks payable to</div>
            <div class="font-bold mb-0.5 text-sm">PT REXINDO ARUNA SEDAYA</div>
            <div class="mb-0.5">Bank Central Asia (BCA) KCP Surya Kencana Bogor</div>
            <div><span>Swift Code :</span><span class="text-gray-700 ml-1">CENAIDJA</span></div>
            <div><span>IDR Account # :</span><span class="text-gray-700 ml-1 font-bold">737.067.5303</span></div>
        </div>

        <!-- Contact Info and Thank You message, pushed to the bottom -->
        <div class="footer-content">
            <div class="text-xs leading-tight text-gray-700 mt-2 text-center">
                <div class="mt-0.5">If you have any questions about this invoice, please contact</div>
                <div>PT Rexindo Aruna Sedaya, phone: <span class="font-bold">+62 85723000060</span>, email: <span class="font-bold">support@rexcorp.id</span></div>
            </div>
            <div class="text-center text-xs mt-3.5 text-gray-600 font-bold">
                Thank You For Your Business!
            </div>
        </div>
    </div>

</body>
</html>
`;

interface ClientInvoiceDetailViewProps {
    invoice: Invoice | null; // Null for new invoice
    onBack: () => void;
    onSave: (invoice: Invoice) => void;
}

const getNextInvoiceNumber = () => {
    const lastInvoice = INVOICES_DATA.reduce((latest, inv) => {
        const latestNum = parseInt(latest.invoiceNumber.split('-')[2], 10);
        const currentNum = parseInt(inv.invoiceNumber.split('-')[2], 10);
        return currentNum > latestNum ? inv : latest;
    });
    const nextNum = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10) + 1;
    return `ACC-SINV-2025-${String(nextNum).padStart(5, '0')}`;
};

const newInvoiceTemplate: Invoice = {
    id: String(Date.now()),
    invoiceNumber: getNextInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    contractNumber: '',
    status: 'Draft',
    billedToId: '',
    billedToName: '',
    billedToAddress1: '',
    billedToAddress2: '',
    billedToCountry: '',
    billedToPhone: '',
    origin: '',
    destination: '',
    termsOfTrade: 'FOB',
    payment: 'Wire Transfer, 30 Days',
    items: [{ id: 1, description: '', quantity: 1, unitPrice: 0, taxed: false, amount: 0 }],
    subtotal: 0,
    taxable: 0,
    taxRate: 0,
    taxDue: 0,
    otherCharges: 0,
    totalAmount: 0,
    otherComments: 'Payment to be made within 30 days of invoice date.',
    quantityUnit: 'Kg'
};

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);

const ClientInvoiceDetailView: React.FC<ClientInvoiceDetailViewProps> = ({ invoice, onBack, onSave }) => {
    const isNew = !invoice;
    const [invoiceData, setInvoiceData] = useState<Invoice>(invoice ? JSON.parse(JSON.stringify(invoice)) : newInvoiceTemplate);
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

    const recalculateInvoice = (inv: Invoice): Invoice => {
        const calculatedItems = inv.items.map(item => {
            const qty = item.quantity === '' || isNaN(Number(item.quantity)) ? 0 : Number(item.quantity);
            const price = item.unitPrice === '' || isNaN(Number(item.unitPrice)) ? 0 : Number(item.unitPrice);
            const amount = qty * price;
            return {
                ...item,
                amount
            };
        });
        const subtotal = calculatedItems.reduce((acc, item) => acc + item.amount, 0);
        const taxRate = Number(inv.taxRate) || 0;
        const otherCharges = inv.otherCharges === '' || isNaN(Number(inv.otherCharges)) ? 0 : Number(inv.otherCharges);
        const taxDue = subtotal * (taxRate / 100);
        const totalAmount = subtotal + taxDue + otherCharges;
        return {
            ...inv,
            items: calculatedItems,
            subtotal,
            taxDue,
            totalAmount
        };
    };

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
        const timer = setTimeout(handleResize, 50); // Shorter timeout

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [zoom, isPreview, isPrintSettingsOpen]);

    const handleInputChange = (field: keyof Invoice, value: any) => {
        setInvoiceData(prev => {
            const updated = { ...prev, [field]: value };
            return recalculateInvoice(updated);
        });
    };

    const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
        setInvoiceData(prev => {
            const updatedItems = prev.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            const updated = { ...prev, items: updatedItems };
            return recalculateInvoice(updated);
        });
    };

    const handleAddItem = () => {
        setInvoiceData(prev => {
            const updatedItems = [...prev.items, { id: Date.now(), description: '', quantity: 1, unit: 'Kg', unitPrice: 0, taxed: false, amount: 0 }];
            const updated = { ...prev, items: updatedItems };
            return recalculateInvoice(updated);
        });
    };

    const handleRemoveItem = (id: number) => {
        setInvoiceData(prev => {
            const updatedItems = prev.items.filter(item => item.id !== id);
            const updated = { ...prev, items: updatedItems };
            return recalculateInvoice(updated);
        });
    };
    
    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        
        const cachedEmails = JSON.parse(localStorage.getItem('CUSTOMER_EMAILS') || '{}');
        const cachedPhones = JSON.parse(localStorage.getItem('CUSTOMER_PHONES') || '{}');
        const cachedAddresses = JSON.parse(localStorage.getItem('CUSTOMER_ADDRESSES') || '{}');

        setInvoiceData(prev => ({ 
            ...prev, 
            billedToId: customerId, 
            billedToName: customer?.name || '',
            billedToAddress1: cachedAddresses[customerId] || 'Ciwaru Indah residence',
            billedToAddress2: customer?.territory || 'Jawa Barat, Indonesia',
            billedToPhone: cachedPhones[customerId] || '+62...',
            billedToCountry: 'Indonesia'
        }));
    };

    const handleSave = () => {
        onSave(invoiceData);
        setIsPreview(true); // Switch to preview after saving
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    const generatePreviewHtml = () => {
        let html = INVOICE_TEMPLATE_HTML;
        
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

        const itemRowsHtml = invoiceData.items.map(item => `
            <tr>
                <td class="px-3 py-2 text-sm">${item.description}</td>
                <td class="px-3 py-2 text-sm">${(item.quantity || 0).toLocaleString()}</td>
                <td class="px-3 py-2 text-sm">${(item.unitPrice || 0).toFixed(2)}</td>
                <td class="px-3 py-2 text-sm">${item.taxed ? 'Yes' : ''}</td>
                <td class="px-3 py-2 text-sm">${item.amount.toFixed(2)}</td>
            </tr>`).join('') || `<tr><td colspan="5" class="px-3 py-2 text-sm text-center text-gray-500">(No items)</td></tr>`;
        
        const replacements = {
            '{{companyHeaderHtml}}': headerHtml,
            '{{quantityUnit}}': invoiceData.quantityUnit || 'Kg',
            '{{invoiceNumber}}': invoiceData.invoiceNumber,
            '{{invoiceDate}}': new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            '{{contractNumber}}': invoiceData.contractNumber,
            '{{billedToName}}': invoiceData.billedToName,
            '{{billedToAddress1}}': invoiceData.billedToAddress1,
            '{{billedToAddress2}}': invoiceData.billedToAddress2,
            '{{billedToCountry}}': invoiceData.billedToCountry,
            '{{billedToPhone}}': invoiceData.billedToPhone,
            '{{origin}}': invoiceData.origin,
            '{{destination}}': invoiceData.destination,
            '{{termsOfTrade}}': invoiceData.termsOfTrade,
            '{{payment}}': invoiceData.payment,
            '{{itemRows}}': itemRowsHtml,
            '{{subtotal}}': invoiceData.subtotal.toFixed(2),
            '{{taxable}}': invoiceData.taxable.toFixed(2),
            '{{taxRate}}': `${invoiceData.taxRate}%`,
            '{{taxDue}}': invoiceData.taxDue.toFixed(2),
            '{{otherCharges}}': invoiceData.otherCharges.toFixed(2),
            '{{totalAmount}}': formatCurrency(invoiceData.totalAmount),
            '{{otherComments}}': invoiceData.otherComments.replace(/\n/g, '<br>'),
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

    const editorView = ( <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FormField label="Invoice #"><input type="text" value={invoiceData.invoiceNumber} onChange={e => handleInputChange('invoiceNumber', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"/></FormField>
                    <FormField label="Status">
                        <Select value={invoiceData.status} onValueChange={val => handleInputChange('status', val)}>
                            <SelectTrigger className="w-full p-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                    <FormField label="Date"><input type="date" value={invoiceData.invoiceDate} onChange={e => handleInputChange('invoiceDate', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></FormField>
                    <FormField label="Contract #"><input type="text" value={invoiceData.contractNumber} onChange={e => handleInputChange('contractNumber', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></FormField>
                    <FormField label="Qty Unit">
                        <Select value={invoiceData.quantityUnit || 'Kg'} onValueChange={val => handleInputChange('quantityUnit', val)}>
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Billed To</h3><FormField label="Customer"><Select value={invoiceData.billedToId || ''} onValueChange={val => handleCustomerChange(val)}><SelectTrigger className="w-full p-2"><SelectValue placeholder="Select Customer" /></SelectTrigger><SelectContent><SelectItem value="">Select Customer</SelectItem>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></FormField><FormField label="Address"><input value={invoiceData.billedToAddress1} onChange={e => handleInputChange('billedToAddress1', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><div className="grid grid-cols-2 gap-4"><FormField label="Country"><input value={invoiceData.billedToCountry} onChange={e => handleInputChange('billedToCountry', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Phone"><input value={invoiceData.billedToPhone} onChange={e => handleInputChange('billedToPhone', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField></div></div>
                    <div className="space-y-3"><h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Trade Details</h3><FormField label="Origin"><input value={invoiceData.origin} onChange={e => handleInputChange('origin', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Destination"><input value={invoiceData.destination} onChange={e => handleInputChange('destination', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Terms of Trade"><input value={invoiceData.termsOfTrade} onChange={e => handleInputChange('termsOfTrade', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField><FormField label="Payment Terms"><input value={invoiceData.payment} onChange={e => handleInputChange('payment', e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></FormField></div>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Items</h3>
                     <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">
                         <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Quantity Unit (UOM):</span>
                         <select 
                             value={invoiceData.quantityUnit || 'Kg'} 
                             onChange={e => handleInputChange('quantityUnit', e.target.value)} 
                             className="p-1 text-sm border border-red-200 dark:border-red-900 rounded-md bg-white dark:bg-gray-800 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
                         >
                             <option value="Kg">Kg</option>
                             <option value="Pcs">Pcs</option>
                             <option value="g">g</option>
                             <option value="Box">Box</option>
                             <option value="Ltr">Ltr</option>
                             <option value="Ctn">Ctn</option>
                             <option value="Unit">Unit</option>
                         </select>
                     </div>
                 </div>
                 <table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700/50 text-left"><tr><th className="p-2 font-medium text-gray-600 dark:text-gray-300">Description</th><th className="p-2 font-medium text-gray-600 dark:text-gray-300 w-32">Quantity ({invoiceData.quantityUnit || 'Kg'})</th><th className="p-2 font-medium text-gray-600 dark:text-gray-300 w-32">Unit Price</th><th className="p-2 font-medium text-gray-600 dark:text-gray-300 w-32 text-right">Amount</th><th className="p-2 w-12"></th></tr></thead><tbody>{invoiceData.items.map(item => (<tr key={item.id} className="border-b dark:border-gray-700"><td className="p-1"><input value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="w-full p-1.5 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></td><td className="p-1"><input type="number" value={item.quantity} onChange={e => { const val = e.target.value; handleItemChange(item.id, 'quantity', val === '' ? '' : parseFloat(val)); }} className="w-full p-1.5 border rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></td><td className="p-1"><input type="number" value={item.unitPrice} onChange={e => { const val = e.target.value; handleItemChange(item.id, 'unitPrice', val === '' ? '' : parseFloat(val)); }} className="w-full p-1.5 border rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></td><td className="p-2 text-right text-gray-800 font-medium dark:text-gray-200">{formatCurrency(item.amount)}</td><td className="p-1 text-center"><button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500"><XIcon className="h-4 w-4"/></button></td></tr>))}</tbody></table><button onClick={handleAddItem} className="mt-4 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">+ Add Row</button></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Other Comments</h3><textarea value={invoiceData.otherComments} onChange={e => handleInputChange('otherComments', e.target.value)} className="w-full p-2 border rounded-md h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div><div className="space-y-2 text-sm"><h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Summary</h3><div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Subtotal</span><span className="font-medium dark:text-gray-200">{formatCurrency(invoiceData.subtotal)}</span></div><div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300">Tax Due</span><span className="font-medium dark:text-gray-200">{formatCurrency(invoiceData.taxDue)}</span></div><div className="flex justify-between items-center"><label className="text-gray-600 dark:text-gray-300">Other Charges</label><input type="number" value={invoiceData.otherCharges} onChange={e => { const val = e.target.value; handleInputChange('otherCharges', val === '' ? '' : parseFloat(val)); }} className="w-32 p-1.5 border rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></div><div className="border-t dark:border-gray-700 pt-2 mt-2"><div className="flex justify-between items-center text-lg font-bold"><span className="text-gray-800 dark:text-gray-100">TOTAL</span><span className="dark:text-white">{formatCurrency(invoiceData.totalAmount)}</span></div></div></div></div></div>

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
                    isPrintSettingsOpen ? <ChevronDoubleLeftIcon className="h-5 w-5" /> : <ChevronDoubleRightIcon className="h-5 w-5" />
                  ) : (
                    <MenuIcon className="h-5 w-5" />
                  )}
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{invoiceData.invoiceNumber}</h1>
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
                <button onClick={handlePrint} className="px-4 py-1.5 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 flex items-center space-x-2 dark:bg-blue-600 dark:hover:bg-blue-700"><PrinterIcon className="h-4 w-4"/><span>Print</span></button>
            </div>
        </div>
    );
    
    const editorHeader = (
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isNew ? 'New Invoice' : `${invoice?.invoiceNumber}`}</h1>
            </div>
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
                                    <FormField label="Print Format"><input placeholder="" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" /></FormField>
                                    <FormField label="Language"><input value="en" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" readOnly /></FormField>
                                    <FormField label="Letter Head"><input value="Gadget House" className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm" readOnly/></FormField>
                                    <div className="space-y-2 pt-4 border-t mt-2 dark:border-gray-700">
                                        <label className="flex items-center space-x-2"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600"/> <span className="text-sm text-gray-700 dark:text-gray-300">Compact Item Print</span></label>
                                        <label className="flex items-center space-x-2"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600"/> <span className="text-sm text-gray-700 dark:text-gray-300">Print UOM after Quantity</span></label>
                                        <label className="flex items-center space-x-2"><Checkbox className="rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600"/> <span className="text-sm text-gray-700 dark:text-gray-300">Print taxes with zero amount</span></label>
                                    </div>
                                </div>
                            </aside>
                        )}
                        <main ref={containerRef} className="flex-1 flex flex-col rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-900/50">
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-center py-8 px-8">
                                    <div className="bg-white shadow-lg" style={{ width: '210mm', transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
                                        <iframe ref={iframeRef} srcDoc={generatePreviewHtml()} className="w-full border-0" style={{ height: '297mm' }} title="Invoice Preview" />
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

export default ClientInvoiceDetailView;