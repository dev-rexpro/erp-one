# REXOne ERP - Export-Import & Logistics Management System

REXOne ERP is a premium, enterprise-grade Enterprise Resource Planning system tailored specifically for modern export-import corporations, logistics operators, and global trade coordinators. Built on a state-of-the-art frontend stack, it features interactive dashboards, advanced data tables, document workflows, and integrated AI capabilities.

---

## Key Modules & Features

### 1. Commercial Module
* **Client Accounts**: Manage detailed client directories, shipping profiles, and credit terms.
* **Service Quotations**: Draft, review, and issue freight and service quotations.
* **Client Contracts**: Store, track, and monitor service-level agreements and commercial trade contracts.

### 2. Logistics & Shipments
* **Shipments Directory**: Comprehensive dashboard listing all active bookings, routes, carrier details, and shipment milestones.
* **Cargo Tracking**: Real-time cargo tracking and transit logs.
* **Packing Manifests**: Digitally create, edit, and validate packing lists.
* **Shipping Instructions**: Draft and transmit detailed cargo handling instructions to carriers and agents.
* **DnD Fee (Demurrage & Detention)**: Easily calculate demurrage and detention charges for container return delays.

### 3. Compliance & Customs
* **Customs Declarations**: Track import/export customs clearance filings, document logs, and customs agent assignments.
* **Trade Licenses**: Registry for regulatory licenses, import quotas, and certification checks.
* **Duty Tariffs**: Built-in calculator and database for HS codes, duty rates, and trade tariffs.

### 4. Finance & Accounting
* **Client Invoicing**: Draft, review, and issue trade invoices to clients.
* **Accounts Receivable**: Monitor unpaid invoices, client payments, and aging reports.
* **Cost Accruals**: Track accrued logistics expenses, freight costs, and local port charges.
* **Vendor Bills**: Log and approve vendor invoices from shipping lines and terminal operators.
* **General Ledger**: Financial reports, transaction registries, and P&L visualizations.

### 5. AI System Intelligence
* **Gemini Assistant**: Integrated AI assistant powered by Google's Gemini API to analyze shipment status, explain tariff regulations, search HS codes, and generate trade forecasts.

### 6. Document Hub
* A centralized vault for storing and linking critical trade documentation (Bill of Lading, Packing Lists, Commercial Invoices, Certificates of Origin) directly to shipments and client folders.

---

## Design & User Experience Features

* **Sleek Glassmorphism & Micro-animations**: Harmonious custom color palettes tailored for high visual fidelity and premium aesthetic appeal.
* **Global Dark Mode**: Full first-class dark mode support with automatic OS scheme sync and system theme toggling.
* **Consistent Custom Scrollbars**: Seamless, custom scrollbars rendered using Radix UI `ScrollArea` (no clunky native browser arrow buttons, auto-reveal on hover).
* **Live Status Bar**: Bottom status bar showcasing system network status, database connection, active Git branch, live-updating clock (`tabular-nums` alignment), and a **real-time fluctuating USD/IDR exchange rate ticker** with visual flash indicators (green/red) on rate changes.

---

## Technology Stack

* **Core Framework**: React 19, TypeScript 5, Vite 6
* **Styling**: Tailwind CSS v4, custom CSS variable-driven themes
* **Primitives**: Radix UI Primitives (consolidated `radix-ui` library)
* **Charts**: Recharts (for dashboards, P&L graphs, and revenue trends)
* **AI API**: Google Gemini API via `@google/genai`

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **NPM** (v9 or higher)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd erp-one
   ```

2. Install the node packages and dependencies:
   ```bash
   npm install
   ```

3. Configure your API key:
   Create a `.env.local` file in the root directory and set your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the App Locally

Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Building for Production

Compile and bundle the application for production deployment:
```bash
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```

---

## Repository Structure

```text
├── components/          # React layout, module dashboards, and view components
│   ├── ui/              # Reusable base components (Select, Input, ScrollArea, etc.)
│   ├── Header.tsx       # Top header bar with static non-shifting breadcrumbs
│   ├── Sidebar.tsx      # Left navigation sidebar with ScrollArea component
│   └── StatusBar.tsx    # Bottom status bar with real-time tickers
├── constants.tsx        # Application constants, icons, and mock database records
├── hooks/               # Custom React state hooks
├── lib/                 # Tailwind / CSS utility functions
├── services/            # Gemini API and external helper services
├── types.ts             # Global TypeScript type definitions
├── index.css            # CSS styles (contains custom themes and scrollbar rules)
├── index.html           # Main HTML entry point
├── package.json         # Package dependencies and project metadata
└── tsconfig.json        # TypeScript configuration settings
```
