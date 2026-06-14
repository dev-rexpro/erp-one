

import React from 'react';
import ShipmentRevenueChart from './ShipmentRevenueChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    DASHBOARD_SUMMARY_CARDS,
    DASHBOARD_QUICK_ACCESS,
    DASHBOARD_REPORTS_MASTERS,
    ArrowUpRightIcon
} from '../constants';
import type { DashboardSummaryCardData, DashboardQuickAccessLink, DashboardReportCategory } from '../types';

const SummaryCard: React.FC<{ card: DashboardSummaryCardData }> = ({ card }) => (
    <Card key={card.id} className="rounded-lg border border-gray-200 bg-white p-5 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <card.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</dt>
                    <dd>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{card.value}</div>
                    </dd>
                </dl>
            </div>
        </div>
    </Card>
);


const QuickAccessLink: React.FC<{ link: DashboardQuickAccessLink }> = ({ link }) => (
    <Button
        variant="outline"
        className="w-full justify-between text-sm font-medium text-gray-700 dark:text-gray-300 p-2 transition-colors duration-150"
    >
        <div className="flex items-center space-x-3">
            <link.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span>{link.label}</span>
        </div>
        {link.count && (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">{link.count}</span>
        )}
    </Button>
);


const HomeDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
        {/* Your Shortcuts - Summary Cards */}
        <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Shortcuts</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {DASHBOARD_SUMMARY_CARDS.map(card => <SummaryCard key={card.id} card={card} />)}
            </div>
        </div>

        {/* Operational Summary Section */}
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Operational Summary</h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ShipmentRevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Quick Access</h3>
                    <div className="mt-4 flex flex-col space-y-4">
                        {DASHBOARD_QUICK_ACCESS.map(link => <QuickAccessLink key={link.id} link={link} />)}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Reports & Masters Section */}
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Reports & Master Data</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
                {DASHBOARD_REPORTS_MASTERS.map(category => (
                    <div key={category.id}>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{category.title}</h3>
                        <ul className="mt-2 space-y-1">
                            {category.links.map(link => (
                                <li key={link.id}>
                                    <Button asChild variant="ghost" className="w-full justify-between px-0 text-sm text-left text-gray-600 hover:font-semibold hover:bg-transparent dark:text-gray-400">
                                        <a href="#" className="flex items-center justify-between space-x-2">
                                            <span>{link.label}</span>
                                            <ArrowUpRightIcon />
                                        </a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HomeDashboard;