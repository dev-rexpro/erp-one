import React from 'react';
import { FileCode, FileText, Landmark, Plus, UploadCloud, Search } from 'lucide-react';

const DocumentCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="flex items-start space-x-4 rounded-lg bg-white p-6 transition hover:shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50">
        <div className="flex-shrink-0 rounded-md bg-gray-100 p-3 dark:bg-gray-700">
            {icon}
        </div>
        <div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    </div>
);


const DocumentHubView: React.FC = () => {
    const documentTypes = [
        {
            title: "Bill of Lading (B/L) & Air Waybill (AWB)",
            description: "Manage contracts of carriage for sea and air freight.",
            icon: <FileCode className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        },
        {
            title: "Customs Declarations (PEB)",
            description: "Create and track export declarations for customs authorities.",
            icon: <Landmark className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        },
        {
            title: "Certificates of Origin (COO)",
            description: "Handle documents certifying the country of origin of goods.",
            icon: <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        },
        {
            title: "Commercial Invoices & Packing Lists",
            description: "Generate and store key commercial and shipping documents.",
            icon: <FileCode className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        },
        {
            title: "Permits & Special Certificates",
            description: "Upload and manage Health, Phytosanitary, and other required certificates.",
            icon: <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        },
        {
            title: "Shipping Instructions",
            description: "Issue and archive instructions to carriers and partners.",
            icon: <FileCode className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Document Hub</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Centralized management for all your critical export-import documents.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                        <UploadCloud className="h-4 w-4" />
                        <span>Bulk Upload</span>
                    </button>
                    <button className="flex items-center space-x-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
                        <span>Create Document</span>
                    </button>
                </div>
            </div>
            
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search documents by type, shipment ID, or keyword..."
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 pl-12 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {documentTypes.map(doc => (
                    <DocumentCard key={doc.title} title={doc.title} description={doc.description} icon={doc.icon} />
                ))}
            </div>
        </div>
    );
};

export default DocumentHubView;