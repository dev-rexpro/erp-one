import type { ReactNode } from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  subItems?: SidebarNavItem[];
  href?: string;
}

export interface ChartData {
    name: string;
    shipments: number; // Represents volume
    revenue: number; // Represents value
    pnl?: number; // Optional for other charts
}

export interface DashboardSummaryCardData {
  id: string;
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
}

export interface DashboardQuickAccessLink {
    id:string;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
}

export interface DashboardReportCategory {
    id: string;
    title: string;
    links: { id: string; label: string; }[];
}

export interface SetupStep {
    id: string;
    label:string;
    status: 'completed' | 'current' | 'pending';
}

export interface ProfitLossData {
    name: string;
    value: number;
}

export interface SimpleShortcut {
    id: string;
    label: string;
}

export interface ReportCategory {
    id: string;
    title: string;
    links: { id: string; label: string; }[];
}

export interface ReceivablesShortcut {
    id: string;
    label: string;
    count?: number;
}

export interface TrendData {
    name: string;
    value: number;
}

export interface Customer {
    id: string;
    name: string;
    status: 'Enabled' | 'Disabled';
    group: string;
    territory: string;
    originalId: string;
    lastUpdated: string;
    comments: number;
    likes: number;
    initials?: string;
}

export interface Activity {
    id: string;
    type: 'comment' | 'system';
    user: string;
    avatarInitials?: string;
    timestamp: string;
    content: string | React.ReactNode;
}

export interface Quotation {
    id: string;
    clientName: string;
    status: 'Cancelled' | 'Open' | 'Expired' | 'Draft';
    date: string;
    grandTotal: string;
    quotationId: string;
    comments: number;
    likes: number;
}

export interface QuotationItem {
    id: number;
    itemCode: string;
    quantity: number;
    rate: number;
}

export interface CustomerContract {
    id: string;
    contractId: string;
    customerName: string;
    status: 'Active' | 'Expired' | 'Draft' | 'Terminated';
    startDate: string;
    endDate: string;
    totalValue: string;
    comments: number;
    likes: number;
}

export interface ContractServiceItem {
    id: number;
    serviceName: string;
    description: string;
    rate: number;
    unit: 'Per Shipment' | 'Per Container' | 'Per Hour' | 'Fixed';
    quantity: number;
}

export interface Breadcrumb {
    label: string;
    onClick?: () => void;
}

// --- Operations & Shipments Types ---

export type ShipmentStatus = 'Booked' | 'In Transit' | 'Customs Clearance' | 'Delivered' | 'On Hold';
export type ShipmentMode = 'Sea' | 'Air' | 'Land';

export interface Shipment {
    id: string;
    shipmentId: string;
    clientName: string;
    origin: string;
    destination: string;
    status: ShipmentStatus;
    mode: ShipmentMode;
    etd: string; // Estimated Time of Departure
    eta: string; // Estimated Time of Arrival
    lastUpdated: string;
}

export interface OperationsDashboardCard {
    id: string;
    title: string;
    value: string;
    icon: React.FC<{ className?: string }>;
}

export interface OperationsDashboardShortcut {
    id: string;
    label: string;
    view: string;
    isSubView: boolean;
    icon: React.FC<{ className?: string }>;
}


export interface ShipmentStatusChartItem {
    name: ShipmentStatus;
    value: number;
    fill: string;
}

export interface PackingListItem {
    id: number;
    itemNumber: string;
    description: string;
    packageCount: number;
    netWeight: number; // in kg
    grossWeight: number; // in kg
    packageText?: string;
    quantity?: number | '';
    unit?: string;
}

export interface PackingList {
    id: string;
    packingListNumber: string;
    packingListDate: string;
    status: 'Draft' | 'Confirmed' | 'Cancelled';
    
    // Linked Documents
    shipmentId: string;
    invoiceNumber: string;
    contractNumber: string;
    
    // Parties
    billToId: string;
    billToName: string;
    billToAddress1: string;
    billToAddress2: string;
    billToCountry: string;
    billToPhone: string;

    shipToName: string;
    shipToAddress1: string;
    shipToAddress2: string;
    shipToCountry: string;
    shipToPhone: string;
    
    // Details
    orderDate: string;
    customerContact: string;
    
    // Items
    items: PackingListItem[];
    
    // Summary
    totalNetWeight: number;
    totalGrossWeight: number;
    totalQuantity?: number;
    totalPackageText?: string;

    // Other
    comments: string;
    quantityUnit?: string;
}

export interface ShippingInstruction {
    id: string;
    shippingInstructionNumber: string;
    shippingInstructionDate: string;
    status: 'Draft' | 'Sent' | 'Confirmed' | 'Cancelled';
    
    // Linked Docs
    packingListId: string;
    invoiceId: string;
    
    // Parties
    toParty: string; // Forwarder
    emklParty: string; // Optional other party

    shipperName: string;
    shipperAddress1: string;
    shipperAddress2: string;
    shipperAddress3: string;
    shipperPhone: string;

    consigneeName: string;
    consigneeAddress1: string;
    consigneeAddress2: string;
    consigneeAddress3: string;
    consigneePhone: string;
    
    notifyPartyName: string;
    notifyPartyEmail: string;

    // Cargo & Shipment Details
    goodsDescription: string;
    grossWeight: string; // e.g., "10,295 KGS"
    portOfLanding: string;
    portOfDelivery: string;
    partyContainer: string; // e.g., "1x40' HQ FCL"
    freightTerm: string; // e.g., "FREIGHT PREPAID"
    freightType: string;
    insuranceStatus: string;
    dateOfStuffing: string;
    placeOfStuffing: string;
    
    // Other
    remarksText: string;
}


// --- Finance & Accounting Types ---

export interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    taxed: boolean;
    amount: number;
    unit?: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    contractNumber: string;
    status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
    
    // Billed To
    billedToId: string; // customerId
    billedToName: string;
    billedToAddress1: string;
    billedToAddress2: string;
    billedToCountry: string;
    billedToPhone: string;
    
    // Trade
    origin: string;
    destination: string;
    termsOfTrade: string;
    payment: string;

    // Items
    items: InvoiceItem[];

    // Summary
    subtotal: number;
    taxable: number;
    taxRate: number;
    taxDue: number;
    otherCharges: number;
    totalAmount: number;

    // Other
    otherComments: string;
    quantityUnit?: string;
}

// --- System Settings ---
export interface CompanySettings {
  name: string;
  address: string;
  adminEmail: string;
  logo: string | null; // Base64 encoded image
  fiscalYearStart: string; // YYYY-MM-DD
  defaultCurrency: 'USD' | 'IDR' | 'EUR';
  timezone: string;
}

export interface StatusBarSettings {
  showSystemStatus: boolean;
  showDatabaseStatus: boolean;
  showSyncStatus: boolean;
  showExchangeRate: boolean;
  showDateTime: boolean;
  showCurrentUser: boolean;
  showVersion: boolean;
}