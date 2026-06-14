
import React from 'react';
import { FINANCIAL_REPORTS_DATA, ArrowUpRightIcon } from '../constants';

const FinancialReportsView: React.FC = () => {
  const mainCategories = FINANCIAL_REPORTS_DATA.slice(0, 3);
  const otherReportsCategory = FINANCIAL_REPORTS_DATA.find(cat => cat.id === 'other-reports');

  return (
    <div className="space-y-8 rounded-lg border border-gray-200 bg-white p-8 dark:bg-gray-800 dark:border-gray-700">
      {/* Main Reports Section */}
      <div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {mainCategories.map(category => (
            <div key={category.id}>
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">{category.title}</h3>
              <ul className="mt-3 space-y-2">
                {category.links.map(link => (
                  <li key={link.id}>
                    <a href="#" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      <span>{link.label}</span>
                       <ArrowUpRightIcon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Other Reports Section */}
      {otherReportsCategory && (
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">{otherReportsCategory.title}</h3>
          <ul className="mt-3 space-y-2">
            {otherReportsCategory.links.map(link => (
              <li key={link.id}>
                <a href="#" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  <span>{link.label}</span>
                  <ArrowUpRightIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FinancialReportsView;