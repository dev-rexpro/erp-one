
import React from 'react';
import { 
    ComposedChart, 
    Bar, 
    Line,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend
} from 'recharts';
import { SHIPMENT_REVENUE_DATA, FilterIcon, DotsHorizontalIcon } from '../constants';

const formatRevenueAxis = (tickItem: number) => `$${tickItem / 1000}k`;
const formatShipmentAxis = (tickItem: number) => `${tickItem}`;

const ShipmentRevenueChart: React.FC = () => {
    return (
        <div className="rounded-lg border-gray-200 bg-transparent p-6 -m-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shipment Volume vs. Revenue</h3>
                <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FilterIcon />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <DotsHorizontalIcon />
                    </button>
                </div>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={SHIPMENT_REVENUE_DATA}
                        margin={{ top: 5, right: 20, left: -20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tickLine={false} 
                            axisLine={{ stroke: '#E5E7EB' }} 
                            dy={10} 
                            tick={{ fontSize: 12 }} 
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#3B82F6"
                            tickFormatter={formatShipmentAxis}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                        />
                         <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#F472B6"
                            tickFormatter={formatRevenueAxis}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            }}
                            formatter={(value: number, name: string) => {
                                if (name === 'revenue') {
                                    return [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), 'Revenue'];
                                }
                                return [value, 'Shipments'];
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Bar yAxisId="left" dataKey="shipments" fill="#3B82F6" name="Shipments" barSize={20} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F472B6" name="Revenue" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ShipmentRevenueChart;