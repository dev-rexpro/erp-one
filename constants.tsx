

import React from 'react';
import { 
    SidebarNavItem, 
    ChartData, 
    DashboardSummaryCardData, 
    DashboardQuickAccessLink, 
    DashboardReportCategory,
    SetupStep,
    ProfitLossData,
    SimpleShortcut,
    ReportCategory,
    ReceivablesShortcut,
    TrendData,
    Customer,
    Activity,
    Quotation,
    CustomerContract,
    OperationsDashboardCard,
    OperationsDashboardShortcut,
    ShipmentStatusChartItem,
    Shipment,
    Invoice,
    PackingList,
    ShippingInstruction,
} from './types';
import {
    Menu,
    Home,
    Library,
    Users,
    Banknote,
    UsersRound,
    Ship,
    Settings,
    ChevronDown,
    Search,
    Bell,
    CheckCircle2,
    Filter,
    MoreHorizontal,
    ChevronsLeft,
    ChevronsRight,
    CircleDollarSign,
    Building2,
    ArrowLeft,
    ArrowRight,
    FileText,
    ArrowUpRight,
    Briefcase,
    ClipboardList,
    Sparkles,
    CircleDot,
    XCircle,
    List,
    RefreshCw,
    X,
    ArrowUpDown,
    MessageSquare,
    Heart,
    Printer,
    Plus,
    Tag,
    Share2,
    Link2,
    ChevronRight,
    Landmark,
    FileCode,
    FileBox,
    Truck,
    Clock,
    Anchor,
    PanelLeft,
    PanelRight,
    AlignLeft,
    AlignRight,
    ShieldCheck,
    Calculator,
    Compass,
    Hourglass,
    Coins,
    TrendingUp,
    FileCheck,
    LineChart,
} from 'lucide-react';


// Icons as React Components, now using Lucide-React
export const MenuIcon: React.FC<{className?: string}> = ({className}) => (<Menu className={className || "h-6 w-6"} strokeWidth={2} />);
export const HomeIcon: React.FC = () => (<Home className="h-5 w-5" strokeWidth={1.5} />);
export const AccountingIcon: React.FC = () => (<Library className="h-5 w-5" strokeWidth={1.5} />);
export const PayrollIcon: React.FC = () => (<Banknote className="h-5 w-5" strokeWidth={1.5} />);
export const CRMIcon: React.FC = () => (<UsersRound className="h-5 w-5" strokeWidth={1.5} />);
export const ProjectsIcon: React.FC = () => (<Ship className="h-5 w-5" strokeWidth={1.5} />);
export const ShipIcon: React.FC<{className?: string}> = ({className}) => (<Ship className={className || "h-5 w-5"} />);
export const SettingsIcon: React.FC = () => (<Settings className="h-5 w-5" strokeWidth={1.5} />);
export const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (<ChevronDown className={className || "h-5 w-5"} strokeWidth={1.5} />);
export const SearchIcon: React.FC<{className?: string}> = ({className}) => (<Search className={className || "h-5 w-5 text-gray-400"} strokeWidth={2} />);
export const BellIcon: React.FC = () => (<Bell className="h-6 w-6" strokeWidth={1.5} />);
export const CheckCircleIcon: React.FC<{className?:string}> = ({className}) => (<CheckCircle2 className={className || "h-5 w-5"} />);
export const FilterIcon: React.FC<{className?: string}> = ({className}) => (<Filter className={className || "h-5 w-5"} strokeWidth={2} />);
export const DotsHorizontalIcon: React.FC<{className?: string}> = ({className}) => (<MoreHorizontal className={className || "h-5 w-5"} strokeWidth={2} />);
export const ChevronDoubleLeftIcon: React.FC<{className?: string}> = ({className}) => (<ChevronsLeft className={className || "w-6 h-6"} strokeWidth={1.5} />);
export const ChevronDoubleRightIcon: React.FC<{className?: string}> = ({className}) => (<ChevronsRight className={className || "w-6 h-6"} strokeWidth={1.5} />);
export const CurrencyDollarIcon: React.FC<{className?: string}> = ({className}) => (<CircleDollarSign className={className || "h-5 w-5"} strokeWidth={1.5} />);
export const UserGroupIcon: React.FC<{className?: string}> = ({className}) => (<Building2 className={className || "h-5 w-5"} strokeWidth={1.5} />);
export const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (<ArrowLeft className={className || "h-5 w-5"} strokeWidth={2} />);
export const ArrowRightIcon: React.FC<{className?: string}> = ({className}) => (<ArrowRight className={className || "h-5 w-5"} strokeWidth={2} />);
export const DocumentReportIcon: React.FC<{className?: string}> = ({className}) => (<FileText className={className || "h-5 w-5"} strokeWidth={1.5} />);
export const ArrowUpRightIcon: React.FC = () => (<ArrowUpRight className="h-4 w-4" strokeWidth={2} />);
export const BriefcaseIcon: React.FC<{className?: string}> = ({className}) => (<Briefcase className={className || "h-5 w-5"} strokeWidth={1.5} />);
export const UsersIcon: React.FC<{className?: string}> = ({className}) => (<Users className={className || "h-5 w-5"} strokeWidth={1.5} />);
export const ClipboardDocumentListIcon: React.FC<{className?: string}> = ({className}) => (<ClipboardList className={className || "h-5 w-5"} strokeWidth={1.5} />);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (<Sparkles className={className || "w-6 h-6"} strokeWidth={1.5} />);
export const DotCircleIcon: React.FC = () => (<CircleDot className="w-5 h-5 text-blue-500" />);
export const XCircleIcon: React.FC = () => (<XCircle className="w-5 h-5 text-gray-400" />);

export const ListIcon: React.FC<{className?: string}> = ({className}) => (<List className={className || "h-5 w-5"} />);
export const RefreshIcon: React.FC<{className?: string}> = ({className}) => (<RefreshCw className={className || "h-5 w-5"} />);
export const XIcon: React.FC<{className?: string}> = ({className}) => (<X className={className || "h-5 w-5"} />);
export const ArrowUpDownIcon: React.FC<{className?: string}> = ({className}) => (<ArrowUpDown className={className || "h-5 w-5"} />);
export const CommentIcon: React.FC<{className?: string}> = ({className}) => (<MessageSquare className={className || "h-5 w-5"} />);
export const HeartIcon: React.FC<{className?: string}> = ({className}) => (<Heart className={className || "h-5 w-5"} />);
export const PrinterIcon: React.FC<{className?: string}> = ({className}) => (<Printer className={className || "h-5 w-5"} />);
export const PlusIcon: React.FC<{className?: string}> = ({className}) => (<Plus className={className || "h-5 w-5"} />);
export const TagIcon: React.FC<{className?: string}> = ({className}) => (<Tag className={className || "h-5 w-5"} />);
export const ShareIcon: React.FC<{className?: string}> = ({className}) => (<Share2 className={className || "h-5 w-5"} />);
export const AttachmentIcon: React.FC<{className?: string}> = ({className}) => (<Link2 className={className || "h-5 w-5"} />);
export const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (<ChevronRight className={className || "h-5 w-5"} />);
export const CustomsIcon: React.FC = () => (<Landmark className="h-5 w-5" strokeWidth={1.5} />);
export const DocumentHubIcon: React.FC = () => (<FileBox className="h-5 w-5" strokeWidth={1.5} />);
export const FileCodeIcon: React.FC<{className?: string}> = ({className}) => (<FileCode className={className || "h-5 w-5"} />);
export const TruckIcon: React.FC<{className?: string}> = ({className}) => (<Truck className={className || "h-5 w-5"} />);
export const ClockIcon: React.FC<{className?: string}> = ({className}) => (<Clock className={className || "h-5 w-5"} />);
export const DeliveredIcon: React.FC<{className?: string}> = ({className}) => (<Anchor className={className || "h-5 w-5"} />);
export const PackingListIcon: React.FC = () => (<FileBox className="h-5 w-5" strokeWidth={1.5} />);

// New Icons for Panel Toggles
export const PanelLeftIcon: React.FC<{className?: string}> = ({className}) => (<PanelLeft className={className || "h-5 w-5"} strokeWidth={2} />);
export const PanelRightIcon: React.FC<{className?: string}> = ({className}) => (<PanelRight className={className || "h-5 w-5"} strokeWidth={2} />);
export const AlignLeftIcon: React.FC<{className?: string}> = ({className}) => (<AlignLeft className={className || "h-5 w-5"} strokeWidth={2} />);
export const AlignRightIcon: React.FC<{className?: string}> = ({className}) => (<AlignRight className={className || "h-5 w-5"} strokeWidth={2} />);

// Custom World-Class ERP Icon wrappers
export const TradeLicensesIcon: React.FC = () => (<ShieldCheck className="h-5 w-5" strokeWidth={1.5} />);
export const DutyTariffsIcon: React.FC = () => (<Calculator className="h-5 w-5" strokeWidth={1.5} />);
export const CargoTrackingIcon: React.FC = () => (<Compass className="h-5 w-5" strokeWidth={1.5} />);
export const DemurrageDetentionIcon: React.FC = () => (<Hourglass className="h-5 w-5" strokeWidth={1.5} />);
export const VendorRatesIcon: React.FC = () => (<Coins className="h-5 w-5" strokeWidth={1.5} />);
export const PurchaseOrdersIcon: React.FC = () => (<FileCheck className="h-5 w-5" strokeWidth={1.5} />);
export const CostAccrualsIcon: React.FC = () => (<TrendingUp className="h-5 w-5" strokeWidth={1.5} />);
export const GeneralLedgerIcon: React.FC = () => (<LineChart className="h-5 w-5" strokeWidth={1.5} />);


// Data
export const SIDEBAR_ITEMS: SidebarNavItem[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon />, href: '#' },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      icon: <CRMIcon />, 
      subItems: [
        { id: 'client-accounts', label: 'Client Accounts', icon: <UsersIcon /> },
        { id: 'service-quotations', label: 'Service Quotations', icon: <DocumentReportIcon /> },
        { id: 'client-contracts', label: 'Client Contracts', icon: <BriefcaseIcon /> }
      ] 
    },
    { 
      id: 'compliance', 
      label: 'Compliance', 
      icon: <CustomsIcon />, 
      subItems: [
        { id: 'customs-declarations', label: 'Customs Declarations', icon: <CustomsIcon /> },
        { id: 'trade-licenses', label: 'Trade Licenses', icon: <TradeLicensesIcon /> },
        { id: 'duty-tariffs', label: 'Duty Tariffs', icon: <DutyTariffsIcon /> }
      ] 
    },
    { 
      id: 'logistics', 
      label: 'Logistics', 
      icon: <ProjectsIcon />,
      subItems: [
        { id: 'shipments-bookings', label: 'Shipments', icon: <ProjectsIcon /> },
        { id: 'shipping-instructions', label: 'Shipping Instructions', icon: <FileCodeIcon /> },
        { id: 'cargo-manifests', label: 'Packing List', icon: <PackingListIcon /> },
        { id: 'cargo-tracking', label: 'Cargo Tracking', icon: <CargoTrackingIcon /> },
        { id: 'demurrage-detention', label: 'DnD Fee', icon: <DemurrageDetentionIcon /> },
      ]
    },
    { 
      id: 'procurement', 
      label: 'Procurement', 
      icon: <UserGroupIcon />, 
      subItems: [
        { id: 'partner-directory', label: 'Partner Directory', icon: <UsersIcon /> },
        { id: 'vendor-rates', label: 'Vendor Rates', icon: <VendorRatesIcon /> },
        { id: 'purchase-orders', label: 'Purchase Orders', icon: <PurchaseOrdersIcon /> },
      ]
    },
    { 
      id: 'finance', 
      label: 'Finance', 
      icon: <AccountingIcon />, 
      subItems: [
        { id: 'client-invoicing', label: 'Client Invoicing', icon: <CurrencyDollarIcon /> },
        { id: 'accounts-receivable', label: 'Accounts Receivable', icon: <ArrowRightIcon /> },
        { id: 'cost-accruals', label: 'Cost Accruals', icon: <CostAccrualsIcon /> },
        { id: 'vendor-bills', label: 'Vendor Bills', icon: <ArrowLeftIcon /> },
        { id: 'general-ledger', label: 'General Ledger', icon: <GeneralLedgerIcon /> }
      ] 
    },
    { id: 'document-hub', label: 'Document Hub', icon: <DocumentHubIcon /> },
    { id: 'system-intelligence', label: 'System Intelligence', icon: <SparklesIcon className="h-5 w-5"/> },
    { id: 'system-settings', label: 'System Settings', icon: <SettingsIcon /> },
];

export const SHIPMENT_REVENUE_DATA: ChartData[] = [
    { name: 'Jan', shipments: 40, revenue: 120000 },
    { name: 'Feb', shipments: 30, revenue: 95000 },
    { name: 'Mar', shipments: 50, revenue: 150000 },
    { name: 'Apr', shipments: 48, revenue: 140000 },
    { name: 'May', shipments: 60, revenue: 180000 },
    { name: 'Jun', shipments: 55, revenue: 165000 },
];

export const DASHBOARD_SUMMARY_CARDS: DashboardSummaryCardData[] = [
    {
      id: 'active-shipments',
      title: 'Active Shipments',
      value: '24',
      icon: Ship,
    },
    {
      id: 'unpaid-invoices',
      title: 'Overdue Invoices',
      value: '$125,768',
      icon: CurrencyDollarIcon,
    },
    {
      id: 'docs-validation',
      title: 'Documents Awaiting Validation',
      value: '18',
      icon: DocumentReportIcon,
    },
    {
      id: 'new-clients',
      title: 'New Clients This Month',
      value: '12',
      icon: UsersIcon,
    },
];

export const DASHBOARD_QUICK_ACCESS: DashboardQuickAccessLink[] = [
    { id: 'new-shipment', label: 'Create New Shipment', icon: PlusIcon },
    { id: 'clients', label: 'Clients', icon: UsersIcon, count: 86 },
    { id: 'partners', label: 'Partners', icon: BriefcaseIcon, count: 26 },
    { id: 'client-invoices', label: 'Client Invoices', icon: ClipboardDocumentListIcon, count: 128 },
];

export const DASHBOARD_REPORTS_MASTERS: DashboardReportCategory[] = [
    {
        id: 'sales-clients', title: 'Sales & Clients',
        links: [
            { id: 'quote-report', label: 'Quotation Report' },
            { id: 'client-contract-analysis', label: 'Client Contract Analysis' },
            { id: 'client-profitability', label: 'Client Profitability Report' },
        ],
    },
    {
        id: 'operations-documents', title: 'Operations & Shipments',
        links: [
            { id: 'shipping-status-report', label: 'Shipment Status Report' },
            { id: 'customs-doc-report', label: 'Customs Declaration Log' },
            { id: 'carrier-performance', label: 'Carrier Performance Report' },
        ],
    },
    {
        id: 'finance-accounting', title: 'Finance & Accounting',
        links: [
            { id: 'ar-summary', label: 'A/R Aging Summary' },
            { id: 'vendor-bill-summary', label: 'Vendor Bill Summary' },
            { id: 'profit-loss-statement', label: 'Profit & Loss Statement' },
        ],
    },
];

export const SETUP_STEPS: SetupStep[] = [
    { id: '1', label: 'Company Details', status: 'completed' },
    { id: '2', label: 'Tax Settings', status: 'current' },
    { id: '3', label: 'Chart of Accounts', status: 'pending' },
    { id: '4', label: 'Opening Balances', status: 'pending' },
];

export const PROFIT_LOSS_DATA: ProfitLossData[] = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 19 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 5 },
    { name: 'May', value: 2 },
    { name: 'Jun', value: 3 },
];

export const PAYABLES_SHORTCUTS: SimpleShortcut[] = [
    { id: 'new-vendor-bill', label: 'New Vendor Bill' },
    { id: 'record-payment', label: 'Record Payment' },
    { id: 'view-partners', label: 'View Partners' },
];

export const PAYABLES_REPORTS_MASTERS: ReportCategory[] = [
    {
        id: 'bills-and-payments', title: 'Bills and Payments',
        links: [
            { id: 'vendor-bill-report', label: 'Vendor Bill List' },
            { id: 'payment-entry-report', label: 'Payments Made' },
        ],
    },
    {
        id: 'partner-reports', title: 'Partner & Vendor Reports',
        links: [
            { id: 'partner-ledger', label: 'Partner Ledger Summary' },
            { id: 'accounts-payable-report', label: 'Accounts Payable Aging' },
        ],
    },
];

export const RECEIVABLES_SHORTCUTS: ReceivablesShortcut[] = [
    { id: 'new-client-invoice', label: 'New Client Invoice', count: 12 },
    { id: 'receive-payment', label: 'Receive Payment' },
    { id: 'view-clients', label: 'View Clients' },
];

export const RECEIVABLES_REPORTS_MASTERS_MAIN: ReportCategory[] = [
    {
        id: 'orders-and-invoices', title: 'Quotations & Invoices',
        links: [
            { id: 'quotation-report', label: 'Quotation List' },
            { id: 'sales-invoice-report', label: 'Client Invoice List' },
        ],
    },
    {
        id: 'customer-reports', title: 'Client Reports',
        links: [
            { id: 'customer-ledger', label: 'Client Ledger Summary' },
            { id: 'accounts-receivable-report', label: 'Accounts Receivable Aging' },
        ],
    },
];

export const RECEIVABLES_REPORTS_MASTERS_REPORTS_ONLY: ReportCategory = {
    id: 'other-reports',
    title: 'Other Reports',
    links: [
        { id: 'job-profitability', label: 'Job-wise Profitability' },
        { id: 'service-wise-revenue', label: 'Service-wise Revenue' },
    ],
};

export const FINANCIAL_REPORTS_DATA: ReportCategory[] = [
    {
        id: 'financial-statements',
        title: 'Financial Statements',
        links: [
            { id: 'balance-sheet', label: 'Balance Sheet' },
            { id: 'profit-and-loss', label: 'Profit and Loss Statement' },
            { id: 'cash-flow', label: 'Cash Flow' },
        ],
    },
    {
        id: 'general-ledger',
        title: 'General Ledger',
        links: [
            { id: 'general-ledger-report', label: 'General Ledger' },
            { id: 'trial-balance', label: 'Trial Balance' },
        ],
    },
    {
        id: 'taxes',
        title: 'Taxes',
        links: [
            { id: 'tax-report', label: 'Sales and Purchase Tax Register' },
        ],
    },
    {
        id: 'other-reports',
        title: 'Other Reports',
        links: [
            { id: 'gross-profit', label: 'Gross Profit' },
            { id: 'budget-variance', label: 'Budget Variance Report' },
        ],
    },
];

export const REXONE_SETTINGS_SHORTCUTS: SimpleShortcut[] = [
    { id: 'company-profile', label: 'Company Profile' },
    { id: 'user-permissions', label: 'User Permissions' },
    { id: 'data-import', label: 'Data Import' },
    { id: 'email-settings', label: 'Email Settings' },
];

export const REXONE_SETTINGS_CATEGORIES: ReportCategory[] = [
    {
        id: 'company-setup',
        title: 'Company Setup',
        links: [
            { id: 'company-details', label: 'Company Details' },
            { id: 'branches', label: 'Branches' },
            { id: 'warehouses', label: 'Warehouses' },
        ],
    },
    {
        id: 'customization',
        title: 'Customization',
        links: [
            { id: 'print-format', label: 'Print Formats' },
            { id: 'custom-fields', label: 'Custom Fields' },
            { id: 'email-templates', label: 'Email Templates' },
        ],
    },
    {
        id: 'integrations',
        title: 'Integrations',
        links: [
            { id: 'api-keys', label: 'API Keys' },
            { id: 'sso-settings', label: 'Single Sign-On (SSO)' },
            { id: 'payment-gateways', label: 'Payment Gateways' },
        ],
    },
];

export const QUOTATION_FUNNEL_DATA: TrendData[] = [
    { name: 'Received', value: 100 },
    { name: 'Quoted', value: 85 },
    { name: 'Negotiation', value: 40 },
    { name: 'Won', value: 25 },
    { name: 'Lost', value: 60 },
];


export const SALES_DASHBOARD_SHORTCUTS = [
    { id: 'new-quotation', label: 'New Quotation' },
    { id: 'view-clients', label: 'View Clients' },
    { id: 'view-contracts', label: 'View Contracts' },
    { id: 'client-profitability', label: 'Client Profitability Report' },
];

export const SALES_DASHBOARD_REPORTS: ReportCategory[] = [
    {
        id: 'client-management', title: 'Client Management',
        links: [
            { id: 'customer', label: 'Client List' },
            { id: 'contact', label: 'Contact List' },
            { id: 'client-contracts', label: 'Client Contracts' },
        ],
    },
    {
        id: 'sales-invoicing', title: 'Sales & Invoicing',
        links: [
            { id: 'quotation-report', label: 'Quotation Report' },
            { id: 'sales-invoice-report', label: 'Client Invoice Report' },
            { id: 'invoice-aging', label: 'Invoice Aging Report' },
        ],
    },
    {
        id: 'operations-reports', title: 'Operations Reports',
        links: [
            { id: 'shipment-status', label: 'Shipment Status Report' },
            { id: 'cargo-tracking', label: 'Cargo Tracking Log' },
            { id: 'customs-docs', label: 'Customs Documents' },
        ],
    },
    {
        id: 'key-analytics', title: 'Key Analytics',
        links: [
            { id: 'sales-analytics-report', label: 'Sales Funnel Analysis' },
            { id: 'client-profitability', label: 'Client Profitability Analysis' },
        ],
    },
];

export const CUSTOMERS_DATA: Customer[] = [
    { id: '1', name: 'ABC Technologies', status: 'Enabled', group: 'Corporate', territory: 'All Territories', originalId: 'ABC Technologies', lastUpdated: '5 M', comments: 1, likes: 0 },
    { id: '2', name: 'Caren Algate', status: 'Enabled', group: 'Commercial', territory: 'All Territories', originalId: 'Caren Algate', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '3', name: 'Global Innovations', status: 'Enabled', group: 'Individual', territory: 'All Territories', originalId: 'Global Innovations', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '4', name: 'Clara Menezes', status: 'Enabled', group: 'Individual', territory: 'All Territories', originalId: 'Clara Menezes', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '5', name: 'SoluTech', status: 'Enabled', group: 'All', territory: 'All Territories', originalId: 'SoluTech', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '6', name: 'Tech Innovators', status: 'Enabled', group: 'Government', territory: 'North America', originalId: 'Tech Innovators', lastUpdated: '1 y', comments: 0, likes: 0, initials: 'VO' },
    { id: '7', name: 'Ashish Joshi', status: 'Enabled', group: 'Individual', territory: 'All Territories', originalId: 'Ashish Joshi', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '8', name: 'Ketaki Mehta', status: 'Enabled', group: 'Individual', territory: 'All Territories', originalId: 'Ketaki Mehta', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '9', name: 'InnovaCorp', status: 'Enabled', group: 'Individual', territory: 'All Territories', originalId: 'InnovaCorp', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '10', name: 'NexGen Ventures', status: 'Enabled', group: 'Corporate', territory: 'All Territories', originalId: 'NexGen Ventures', lastUpdated: '1 y', comments: 0, likes: 0 },
    { id: '11', name: 'FirstClass Corp.', status: 'Enabled', group: 'Government', territory: 'All Territories', originalId: 'FirstClass Corp.', lastUpdated: '1 y', comments: 0, likes: 0 },
];

export const CUSTOMER_ACTIVITY_LOG: Activity[] = [
    {
        id: '1',
        type: 'comment',
        user: 'You',
        avatarInitials: 'JD',
        timestamp: '8 hours ago',
        content: 'Something to day',
    },
    {
        id: '2',
        type: 'system',
        user: 'Administrator',
        timestamp: '5 months ago',
        content: (
            <span>
                renamed from <strong className="font-semibold text-gray-800">Reliance Industries</strong> to <strong className="font-semibold text-gray-800">ABC Technologies</strong>
            </span>
        ),
    },
    {
        id: '3',
        type: 'system',
        user: 'Administrator',
        timestamp: '5 months ago',
        content: 'last edited this',
    },
    {
        id: '4',
        type: 'system',
        user: 'pushkar@erpnext.com',
        timestamp: '1 year ago',
        content: 'changed the value of Represents Company from null to "", Allow Sales Invoice Creation Without Sales Order from 0 to 1, Allow Sales Invoice Creation Without Delivery Note from 0 to 1',
    },
    {
        id: '5',
        type: 'system',
        user: 'pushkar@erpnext.com',
        timestamp: '1 year ago',
        content: 'created this',
    }
];

export const QUOTATIONS_DATA: Quotation[] = [
    { id: '1', clientName: 'ABC Technologies', status: 'Cancelled', date: '15-08-2025', grandTotal: '₹ 1,999.00', quotationId: 'SAL-QTN-2025-00001', comments: 0, likes: 0 },
    { id: '2', clientName: 'Global Innovations', status: 'Open', date: '23-03-2024', grandTotal: '₹ 6,60,000.00', quotationId: 'SAL-QTN-2024-00002', comments: 0, likes: 0 },
    { id: '3', clientName: 'SoluTech', status: 'Expired', date: '29-07-2024', grandTotal: '₹ 55,999.00', quotationId: 'SAL-QTN-2024-00003', comments: 0, likes: 0 },
    { id: '4', clientName: 'Global Innovations', status: 'Open', date: '25-03-2024', grandTotal: '₹ 6,60,000.00', quotationId: 'SAL-QTN-2024-00004', comments: 0, likes: 0 },
    { id: '5', clientName: 'NexGen Ventures', status: 'Draft', date: '24-03-2024', grandTotal: '₹ 4,66,988.00', quotationId: 'SAL-QTN-2024-00005', comments: 0, likes: 0 },
    { id: '6', clientName: 'Tech Innovators', status: 'Draft', date: '27-03-2024', grandTotal: '₹ 6,60,000.00', quotationId: 'SAL-QTN-2024-00006', comments: 0, likes: 0 },
    { id: '7', clientName: 'NexGen Ventures', status: 'Draft', date: '27-03-2024', grandTotal: '₹ 4,66,988.00', quotationId: 'SAL-QTN-2024-00007', comments: 0, likes: 0 },
    { id: '8', clientName: 'InnovaCorp', status: 'Draft', date: '26-03-2024', grandTotal: '₹ 4,66,988.00', quotationId: 'SAL-QTN-2024-00008', comments: 0, likes: 0 },
    { id: '9', clientName: 'FirstClass Corp.', status: 'Draft', date: '26-03-2024', grandTotal: '₹ 6,60,000.00', quotationId: 'SAL-QTN-2024-00009', comments: 0, likes: 0 },
    { id: '10', clientName: 'NexGen Ventures', status: 'Draft', date: '25-03-2024', grandTotal: '₹ 4,66,988.00', quotationId: 'SAL-QTN-2024-00010', comments: 0, likes: 0 },
];

export const CUSTOMER_CONTRACTS_DATA: CustomerContract[] = [
    { id: '1', contractId: 'CC-2024-0001', customerName: 'Global Innovations', status: 'Active', startDate: '01-01-2024', endDate: '31-12-2024', totalValue: '$50,000.00', comments: 2, likes: 1 },
    { id: '2', contractId: 'CC-2024-0002', customerName: 'ABC Technologies', status: 'Active', startDate: '15-02-2024', endDate: '14-02-2025', totalValue: '$120,000.00', comments: 0, likes: 0 },
    { id: '3', contractId: 'CC-2023-0015', customerName: 'SoluTech', status: 'Expired', startDate: '01-06-2023', endDate: '31-05-2024', totalValue: '$75,000.00', comments: 5, likes: 3 },
    { id: '4', contractId: 'CC-2024-0003', customerName: 'NexGen Ventures', status: 'Draft', startDate: '01-08-2024', endDate: '31-07-2025', totalValue: '$200,000.00', comments: 0, likes: 0 },
    { id: '5', contractId: 'CC-2023-0011', customerName: 'Tech Innovators', status: 'Terminated', startDate: '01-03-2023', endDate: '28-02-2024', totalValue: '$95,000.00', comments: 1, likes: 0 },
];

// --- Operations & Shipments Data ---

export const OPERATIONS_DASHBOARD_CARDS: OperationsDashboardCard[] = [
    { id: 'in-transit', title: 'Shipments In Transit', value: '15', icon: TruckIcon },
    { id: 'at-customs', title: 'Awaiting Customs Clearance', value: '8', icon: CustomsIcon },
    { id: 'delivered', title: 'Delivered (Last 7 Days)', value: '22', icon: DeliveredIcon },
    { id: 'on-hold', title: 'Shipments On Hold', value: '2', icon: ClockIcon },
];

export const OPERATIONS_DASHBOARD_SHORTCUTS: OperationsDashboardShortcut[] = [
    { id: 'manage-shipments', label: 'Manage Shipments', view: 'shipments', isSubView: true, icon: ProjectsIcon },
    { id: 'manage-packing-lists', label: 'Manage Packing Lists', view: 'packing-lists', isSubView: true, icon: PackingListIcon },
    { id: 'manage-si', label: 'Manage Shipping Instructions', view: 'shipping-instructions', isSubView: true, icon: FileCodeIcon },
    { id: 'go-to-doc-hub', label: 'Access Document Hub', view: 'document-hub', isSubView: false, icon: DocumentHubIcon },
];

export const SHIPMENT_STATUS_CHART_DATA: ShipmentStatusChartItem[] = [
    { name: 'In Transit', value: 15, fill: '#3b82f6' },
    { name: 'Customs Clearance', value: 8, fill: '#f97316' },
    { name: 'Booked', value: 5, fill: '#a855f7' },
    { name: 'Delivered', value: 35, fill: '#22c55e' },
    { name: 'On Hold', value: 2, fill: '#ef4444' },
];

export const SHIPMENTS_DATA: Shipment[] = [
    { id: '1', shipmentId: 'REX-001', clientName: 'ABC Technologies', origin: 'Jakarta, ID', destination: 'Singapore, SG', status: 'In Transit', mode: 'Sea', etd: '2024-07-20', eta: '2024-07-25', lastUpdated: '2h ago' },
    { id: '2', shipmentId: 'REX-002', clientName: 'Global Innovations', origin: 'Shanghai, CN', destination: 'Los Angeles, US', status: 'Customs Clearance', mode: 'Sea', etd: '2024-07-10', eta: '2024-08-01', lastUpdated: '1d ago' },
    { id: '3', shipmentId: 'REX-003', clientName: 'SoluTech', origin: 'Frankfurt, DE', destination: 'Dubai, AE', status: 'Delivered', mode: 'Air', etd: '2024-07-18', eta: '2024-07-19', lastUpdated: '3d ago' },
    { id: '4', shipmentId: 'REX-004', clientName: 'NexGen Ventures', origin: 'Surabaya, ID', destination: 'Bangkok, TH', status: 'Booked', mode: 'Land', etd: '2024-07-22', eta: '2024-07-28', lastUpdated: '5h ago' },
    { id: '5', shipmentId: 'REX-005', clientName: 'Tech Innovators', origin: 'Hong Kong, HK', destination: 'New York, US', status: 'In Transit', mode: 'Air', etd: '2024-07-21', eta: '2024-07-22', lastUpdated: '1h ago' },
    { id: '6', shipmentId: 'REX-006', clientName: 'ABC Technologies', origin: 'Singapore, SG', destination: 'Jakarta, ID', status: 'On Hold', mode: 'Sea', etd: '2024-07-15', eta: '2024-07-20', lastUpdated: '2d ago' },
];

// --- Finance & Accounting Data ---

export const INVOICES_DATA: Invoice[] = [
    {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        invoiceDate: '2024-07-28',
        contractNumber: 'CC-2024-0002',
        status: 'Paid',
        billedToId: '1',
        billedToName: 'ABC Technologies',
        billedToAddress1: '123 Tech Park',
        billedToAddress2: 'Silicon Valley',
        billedToCountry: 'USA',
        billedToPhone: '+1 123 456 7890',
        origin: 'Jakarta, ID',
        destination: 'Singapore, SG',
        termsOfTrade: 'CIF Singapore',
        payment: 'Wire Transfer, 30 Days',
        items: [
            { id: 1, description: 'Dried Cuttlefish Bone (Industrial Purposed)', quantity: 10095, unitPrice: 0.70, taxed: false, amount: 7066.50 }
        ],
        subtotal: 7066.50,
        taxable: 0,
        taxRate: 0,
        taxDue: 0,
        otherCharges: 0,
        totalAmount: 7066.50,
        otherComments: 'Payment to be made within 30 days of invoice date.'
    },
    {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        invoiceDate: '2024-07-25',
        contractNumber: 'CC-2024-0001',
        status: 'Unpaid',
        billedToId: '3',
        billedToName: 'Global Innovations',
        billedToAddress1: '456 Innovation Ave',
        billedToAddress2: 'Tech City',
        billedToCountry: 'Germany',
        billedToPhone: '+49 123 456 7890',
        origin: 'Shanghai, CN',
        destination: 'Hamburg, DE',
        termsOfTrade: 'FOB Shanghai',
        payment: 'Letter of Credit',
        items: [
            { id: 1, description: 'Sea Freight - 40ft Container', quantity: 1, unitPrice: 4500, taxed: false, amount: 4500 },
            { id: 2, description: 'Customs Clearance Fee', quantity: 1, unitPrice: 500, taxed: false, amount: 500 }
        ],
        subtotal: 5000,
        taxable: 0,
        taxRate: 0,
        taxDue: 0,
        otherCharges: 0,
        totalAmount: 5000,
        otherComments: 'As per contract CC-2024-0001.'
    },
     {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        invoiceDate: '2024-06-15',
        contractNumber: 'CC-2023-0015',
        status: 'Overdue',
        billedToId: '5',
        billedToName: 'SoluTech',
        billedToAddress1: '789 Solution Street',
        billedToAddress2: 'Business Bay',
        billedToCountry: 'UAE',
        billedToPhone: '+971 123 456 789',
        origin: 'Frankfurt, DE',
        destination: 'Dubai, AE',
        termsOfTrade: 'DAP Dubai',
        payment: 'Wire Transfer, 30 Days',
        items: [
            { id: 1, description: 'Air Freight - 500kg', quantity: 500, unitPrice: 4.5, taxed: false, amount: 2250 }
        ],
        subtotal: 2250,
        taxable: 0,
        taxRate: 0,
        taxDue: 0,
        otherCharges: 0,
        totalAmount: 2250,
        otherComments: 'Invoice is 15 days overdue. Please remit payment immediately.'
    }
];

// --- Packing List Data ---

export const PACKING_LIST_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Packing List - {{packingListNumber}}</title>
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
        .packing-list-page {
            width: 210mm; /* A4 width */
            height: 297mm; /* A4 height */
            min-height: 297mm; /* A4 height */
            max-height: 297mm; /* A4 height */
            margin: 0 auto;
            padding: 10mm 15mm; /* Balanced padding */
            box-sizing: border-box;
            background-color: #fff;
            position: relative; /* Needed for absolute positioning of footer */
            display: flex;
            flex-direction: column;
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
            border-radius: 0.375rem 0.375rem 0 0; /* Rounded top corners only */
        }
        .table-header-red {
            background-color: #c00000;
            color: white;
            font-weight: bold;
        }
        .packing-list-details-box {
            border: 1px solid #c00000;
            padding: 3px 8px; /* Adjusted padding to be tighter */
            font-size: 0.8rem; /* Slightly smaller font for details */
            display: grid;
            grid-template-columns: 1fr 1.5fr; /* Adjust column width for labels and values */
            gap: 2px; /* Tighter gap */
            border-radius: 0 0 0.375rem 0.375rem; /* Rounded bottom corners only */
        }
        .packing-list-details-box span {
            padding: 1px 0;
        }
        .packing-list-details-box .label {
            font-weight: bold;
            color: #555;
        }
        .packing-list-details-box .value {
            font-weight: bold;
            color: #333;
        }
        .packing-list-table {
            border-collapse: collapse; /* Make borders collapse to single lines */
            width: 100%;
        }
        .packing-list-table th, .packing-list-table td {
            border: 1px solid black; /* All cells have a 1px solid black border */
            padding: 6px 8px; /* Tight padding */
            text-align: left; /* Align text to the left */
        }
        .rounded-b-md {
            border-bottom-left-radius: 0.375rem;
            border-bottom-right-radius: 0.375rem;
        }
        .rounded-t-md {
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
        }
        .footer-content {
            margin-top: auto; /* Pushes content to the bottom */
            padding-top: 10px; /* Adjust as needed for spacing from main content */
        }
    </style>
</head>
<body class="bg-gray-100">

    <div class="packing-list-page">
        <!-- Header Section -->
        <div class="flex justify-between items-start mb-4">
            {{companyHeaderHtml}}
            <div class="text-right">
                <div class="text-3xl font-bold text-red-700 mb-1">PACKING LIST</div>
                <div class="packing-list-details-box">
                    <span class="label">DATE</span><span class="value">{{packingListDate}}</span>
                    <span class="label">PACKING LIST #</span><span class="value">{{packingListNumber}}</span>
                </div>
            </div>
        </div>

        <!-- Bill To & Ship To Section -->
        <div class="grid grid-cols-2 gap-4 mb-4">
            <!-- Left Side: Bill To -->
            <div class="flex flex-col">
                <div class="header-red-bar mb-1">BILL TO</div>
                <div class="border border-gray-300 p-2.5 text-xs leading-tight rounded-b-md flex-grow">
                    <div class="font-bold text-sm mb-0.5">{{billToName}}</div>
                    <div>{{billToAddress1}}</div>
                    <div>{{billToCountry}}</div>
                    <div>{{billToPhone}}</div>
                </div>
            </div>

            <!-- Right Side: Ship To -->
            <div class="flex flex-col">
                <div class="header-red-bar mb-1">SHIP TO</div>
                <div class="border border-gray-300 p-2.5 text-xs leading-tight rounded-b-md flex-grow">
                    <div class="font-bold text-sm mb-0.5">{{shipToName}}</div>
                    <div>{{shipToAddress1}}</div>
                    <div>{{shipToCountry}}</div>
                    <div>{{shipToPhone}}</div>
                </div>
            </div>
        </div>

        <!-- Order & Invoice Details - Adjusted to be a table -->
        <table class="packing-list-table mb-4 rounded-md table-fixed">
            <thead>
                <tr>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[25%]">ORDER DATE</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[25%]">CONTRACT #</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[25%]">INVOICE #</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[25%]">CUSTOMER CONTACT</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="px-3 py-1.5 text-xs">{{orderDate}}</td>
                    <td class="px-3 py-1.5 text-xs">{{contractNumber}}</td>
                    <td class="px-3 py-1.5 text-xs">{{invoiceNumber}}</td>
                    <td class="px-3 py-1.5 text-xs">{{customerContact}}</td>
                </tr>
            </tbody>
        </table>

        <!-- Items Table -->
        <table class="packing-list-table mb-4 rounded-md table-fixed">
            <thead>
                <tr>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[15%]">ITEM #</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[45%]">DESCRIPTION</th>
                    <th class="table-header-red px-3 py-1.5 text-left text-xs w-[20%]">PACKAGE</th>
                    <th class="table-header-red px-3 py-1.5 text-right text-xs w-[20%]">QUANTITY ({{quantityUnit}})</th>
                </tr>
            </thead>
            <tbody>
                {{itemRows}}
                <tr class="font-bold">
                    <td class="px-3 py-1.5 text-xs" colspan="2" style="text-align: right; border: 1px solid black;">TOTAL:</td>
                    <td class="px-3 py-1.5 text-xs" style="border: 1px solid black;">{{totalPackageText}}</td>
                    <td class="px-3 py-1.5 text-xs text-right font-bold" style="border: 1px solid black;">{{totalQuantity}}</td>
                </tr>
            </tbody>
        </table>

        <!-- Comments -->
        <div class="header-red-bar mb-1">COMMENTS</div>
        <div class="border border-gray-300 p-2.5 text-xs leading-tight mb-4 rounded-b-md">
            {{comments}}
        </div>

        <!-- This div will push to the bottom of the page -->
        <div class="footer-content">
            <!-- Contact Info -->
            <div class="text-xs leading-tight text-gray-700 mt-2 text-center">
                <div class="mt-0.5">If you have any questions about this packing list, please contact</div>
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

export const PACKING_LISTS_DATA: PackingList[] = [
    {
        id: '1',
        packingListNumber: 'PL-2024-001',
        packingListDate: '2024-07-28',
        status: 'Confirmed',
        shipmentId: 'REX-001',
        invoiceNumber: 'INV-2024-001',
        contractNumber: 'CC-2024-0002',
        billToId: '1',
        billToName: 'ABC Technologies',
        billToAddress1: '123 Tech Park',
        billToAddress2: 'Silicon Valley',
        billToCountry: 'USA',
        billToPhone: '+1 123 456 7890',
        shipToName: 'ABC Technologies SG',
        shipToAddress1: '789 Marina Bay',
        shipToAddress2: 'Level 10',
        shipToCountry: 'Singapore',
        shipToPhone: '+65 9876 5432',
        orderDate: '2024-07-15',
        customerContact: 'john.doe@abctech.com',
        items: [
            { id: 1, itemNumber: 'CB-001', description: 'Dried Cuttlefish Bone (Industrial Purposed), Size 5-10cm', packageCount: 200, netWeight: 10095, grossWeight: 10295 }
        ],
        totalNetWeight: 10095,
        totalGrossWeight: 10295,
        comments: 'Handle with care. Store in a dry place.'
    },
    {
        id: '2',
        packingListNumber: 'PL-2024-002',
        packingListDate: '2024-07-25',
        status: 'Draft',
        shipmentId: 'REX-002',
        invoiceNumber: 'INV-2024-002',
        contractNumber: 'CC-2024-0001',
        billToId: '3',
        billToName: 'Global Innovations',
        billToAddress1: '456 Innovation Ave',
        billToAddress2: 'Tech City',
        billToCountry: 'Germany',
        billToPhone: '+49 123 456 7890',
        shipToName: 'Global Innovations US',
        shipToAddress1: '1 Port Avenue',
        shipToAddress2: 'Long Beach',
        shipToCountry: 'USA',
        shipToPhone: '+1 987 654 3210',
        orderDate: '2024-07-10',
        customerContact: 'jane.smith@globalinnovations.de',
        items: [
            { id: 1, itemNumber: 'MACH-01', description: 'High-Precision CNC Machine', packageCount: 1, netWeight: 1500, grossWeight: 1650 },
            { id: 2, itemNumber: 'PARTS-02', description: 'Spare Parts and Tooling Kit', packageCount: 5, netWeight: 150, grossWeight: 160 }
        ],
        totalNetWeight: 1650,
        totalGrossWeight: 1810,
        comments: 'Contains sensitive electronic equipment.'
    }
];

// --- Shipping Instruction Data ---

export const SHIPPING_INSTRUCTION_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipping Instruction - {{shippingInstructionNumber}}</title>
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
            font-size: 13px; /* Base font size */
            margin: 0;
            padding: 0;
        }
        .si-page {
            width: 210mm; /* A4 width */
            height: 297mm; /* A4 height */
            min-height: 297mm; /* A4 height */
            max-height: 297mm; /* A4 height */
            margin: 0 auto;
            padding: 10mm 12mm; /* Balanced padding */
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            flex-direction: column;
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
        .section-title {
            background-color: #c00000;
            color: white;
            padding: 6px 12px;
            font-weight: bold;
            font-size: 0.95rem;
            text-align: center;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            border: 1px solid black;
            border-radius: 0.375rem;
            overflow: hidden;
        }
        .detail-grid > div {
            border-bottom: 1px solid black;
            padding: 4px 10px; /* Reduced padding */
            font-size: 0.78rem; /* Reduced font size */
            line-height: 1.4;
        }
        .detail-grid > div:nth-child(odd) {
            border-right: 1px solid black;
        }
        .detail-grid-header {
            background-color: #e5e8eb;
            font-weight: bold;
            font-size: 0.82rem; /* Reduced font size */
        }
        .detail-grid > div:nth-last-child(-n+2):not(.detail-grid-header) {
            border-bottom: none;
        }
    </style>
</head>
<body class="bg-gray-100">

    <div class="si-page">
        <!-- Header Section -->
        <div class="flex justify-between items-end mb-4">
            {{companyHeaderHtml}}
            <div class="text-right text-gray-800 text-xs leading-tight flex flex-col justify-end">
                <div class="font-bold mb-1"># : {{shippingInstructionNumber}}</div>
                <div class="font-bold mb-3">DATE : {{shippingInstructionDate}}</div>
                <div class="grid grid-cols-[auto_1fr] gap-x-1 text-left">
                    <strong>TO</strong> <span>: {{toParty}}</span>
                    <strong>EMKL</strong> <span>: {{emklParty}}</span>
                </div>
            </div>
        </div>

        <div class="section-title mb-4 rounded-md">SHIPPING INSTRUCTION</div>

        <!-- Main Content Grid -->
        <div class="detail-grid mb-4">
            <!-- Shipper Section -->
            <div class="detail-grid-header">SHIPPER</div>
            <div class="detail-grid-header">CONSIGNEE</div>
            <div>
                <div class="font-bold">{{shipperName}}</div>
                <div>{{shipperAddress1}}</div>
                <div>{{shipperAddress2}}</div>
                <div>{{shipperAddress3}}</div>
                <div>Phone: {{shipperPhone}}</div>
            </div>
            <div>
                <div class="font-bold">{{consigneeName}}</div>
                <div>{{consigneeAddress1}}</div>
                <div>{{consigneeAddress2}}</div>
                <div>{{consigneeAddress3}}</div>
                <div>Phone: {{consigneePhone}}</div>
            </div>

            <!-- Notify Party Section -->
            <div class="detail-grid-header">NOTIFY PARTY</div>
            <div class="detail-grid-header">NOTIFY PARTY CONTACT</div>
            <div>
                <div>{{notifyPartyName}}</div>
            </div>
            <div>
                <a href="mailto:{{notifyPartyEmail}}" class="text-blue-600 underline">{{notifyPartyEmail}}</a>
            </div>

            <!-- Description of Goods & Gross Weight -->
            <div class="detail-grid-header">DESCRIPTION OF GOODS</div>
            <div class="detail-grid-header">GROSS WEIGHT</div>
            <div>
                <div>{{goodsDescription}}</div>
            </div>
            <div>
                <div>{{grossWeight}}</div>
            </div>

            <!-- Port of Landing & Port of Delivery -->
            <div class="detail-grid-header">PORT OF LANDING</div>
            <div class="detail-grid-header">PORT OF DELIVERY</div>
            <div>
                <div>{{portOfLanding}}</div>
            </div>
            <div>
                <div>{{portOfDelivery}}</div>
            </div>

            <!-- Party & Freight -->
            <div class="detail-grid-header">PARTY</div>
            <div class="detail-grid-header">FREIGHT</div>
            <div>
                <div>{{partyContainer}}</div>
            </div>
            <div>
                <div>{{freightTerm}}</div>
            </div>

            <!-- Freight Type & Insurance -->
            <div class="detail-grid-header">FREIGHT TYPE</div>
            <div class="detail-grid-header">INSURANCE</div>
            <div>
                <div>{{freightType}}</div>
            </div>
            <div>
                <div>{{insuranceStatus}}</div>
            </div>

            <!-- Date of Stuffing & Place of Stuffing -->
            <div class="detail-grid-header">DATE OF STUFFING</div>
            <div class="detail-grid-header">PLACE OF STUFFING</div>
            <div>
                <div>{{dateOfStuffing}}</div>
            </div>
            <div>
                <div>{{placeOfStuffing}}</div>
            </div>
        </div>

        <!-- Remarks Section -->
        <div class="header-red-bar mb-1 rounded-t-md">REMARKS</div>
        <div class="border border-gray-300 p-2 text-xs leading-tight mb-4 rounded-b-md">
            {{remarksText}}
        </div>

        <!-- Thank You & Collaboration -->
        <div class="text-center text-xs mt-6 text-gray-700 font-bold">
            THANK YOU FOR YOUR ATTENTION AND COOPERATION
        </div>

        <!-- Best Regards and Signature placeholder -->
        <div class="flex flex-col items-end mt-6 text-xs">
            <div class="mb-4">Best Regards,</div>
            <!-- Space for stamp -->
            <div class="w-40 h-20 border border-dashed border-gray-400 mb-2 flex items-center justify-center text-gray-500 text-xs">
                SPACE FOR STAMP
            </div>
            <div class="font-bold">
                PT REXINDO ARUNA SEDAYA
            </div>
        </div>
    </div>
</body>
</html>
`;

export const SHIPPING_INSTRUCTIONS_DATA: ShippingInstruction[] = [
    {
        id: '1',
        shippingInstructionNumber: 'SI-2024-001',
        shippingInstructionDate: '2024-07-28',
        status: 'Confirmed',
        packingListId: 'PL-2024-001',
        invoiceId: 'INV-2024-001',
        toParty: 'Maersk Line',
        emklParty: 'PT. Jasa Logistik',
        shipperName: 'PT REXINDO ARUNA SEDAYA',
        shipperAddress1: 'Ciwaru Indah Residence Blok B5',
        shipperAddress2: 'Sukamantri, Tamansari',
        shipperAddress3: 'Kab.Bogor 16610, Indonesia',
        shipperPhone: '+62 85723000060',
        consigneeName: 'ABC Technologies SG',
        consigneeAddress1: '789 Marina Bay',
        consigneeAddress2: 'Level 10',
        consigneeAddress3: 'Singapore',
        consigneePhone: '+65 9876 5432',
        notifyPartyName: 'Same as Consignee',
        notifyPartyEmail: 'imports@abctech.sg',
        goodsDescription: 'Dried Cuttlefish Bone (Industrial Purposed)',
        grossWeight: '10,295 KGS',
        portOfLanding: 'Singapore (SGSIN)',
        portOfDelivery: 'Singapore (SGSIN)',
        partyContainer: "1x40' HQ FCL",
        freightTerm: 'FREIGHT PREPAID',
        freightType: 'CY/CY',
        insuranceStatus: 'By Shipper',
        dateOfStuffing: '2024-07-25',
        placeOfStuffing: 'Shipper\'s Warehouse, Bogor',
        remarksText: 'Please issue 3/3 Original B/L. All goods are of Indonesian origin.'
    }
];