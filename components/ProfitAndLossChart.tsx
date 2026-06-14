import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PROFIT_LOSS_DATA, FilterIcon, DotsHorizontalIcon } from '../constants';

const ProfitAndLossChart: React.FC = () => {
  const formatYAxis = (tickItem: number) => `${tickItem} M`;
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Profit and Loss</h3>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
             <FilterIcon />
          </button>
           <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
             <DotsHorizontalIcon />
           </button>
        </div>
      </div>
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={PROFIT_LOSS_DATA}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            barCategoryGap="40%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }}/>
            <Tooltip
              cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitAndLossChart;