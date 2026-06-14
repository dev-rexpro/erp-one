

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
    OPERATIONS_DASHBOARD_CARDS,
    SHIPMENT_STATUS_CHART_DATA,
    OPERATIONS_DASHBOARD_SHORTCUTS,
    FilterIcon,
    DotsHorizontalIcon,
    ArrowUpRightIcon,
} from '../constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { OperationsDashboardCard, ShipmentStatusChartItem } from '../types';

const SummaryCard: React.FC<{ card: OperationsDashboardCard }> = ({ card }) => (
    <Card key={card.id} className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <card.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</dt>
                    <dd>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</div>
                    </dd>
                </dl>
            </div>
        </div>
    </Card>
);

interface OperationsDashboardProps {
    setActiveView: (view: string) => void;
    setActiveSubView: (view: string | null) => void;
}

const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ setActiveView, setActiveSubView }) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Operations & Shipments Dashboard</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {OPERATIONS_DASHBOARD_CARDS.map(card => <SummaryCard key={card.id} card={card} />)}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Shipment Status Chart */}
                <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shipment Status Distribution</h3>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><FilterIcon /></Button>
                            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><DotsHorizontalIcon /></Button>
                        </div>
                    </div>
                    <div className="mt-6 h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={SHIPMENT_STATUS_CHART_DATA}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {SHIPMENT_STATUS_CHART_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" iconSize={10} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-1 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h3>
                    <div className="mt-6 space-y-4">
                        {OPERATIONS_DASHBOARD_SHORTCUTS.map(shortcut => (
                            <Button
                                key={shortcut.id}
                                variant="outline"
                                className="w-full justify-between text-sm font-medium text-gray-700 dark:text-gray-300 p-2 transition-colors duration-150"
                                onClick={() => shortcut.isSubView ? setActiveSubView(shortcut.view) : setActiveView(shortcut.view)}
                            >
                                <div className="flex items-center space-x-3">
                                    <shortcut.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span>{shortcut.label}</span>
                                </div>
                                <ArrowUpRightIcon />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;