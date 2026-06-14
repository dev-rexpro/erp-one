import React from 'react';
import { SETUP_STEPS, CheckCircleIcon, DotCircleIcon, XCircleIcon } from '../constants';

const SetupGuide: React.FC = () => {
  const getStatusIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-500" />;
      case 'current':
        return <DotCircleIcon />;
      case 'pending':
        return <XCircleIcon />;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Let's Set Up Your Accounts and Taxes.</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Accounts, Invoices, Taxation, and more.</p>
        </div>
        <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
          Dismiss
        </button>
      </div>

      <ul className="mt-6 space-y-1">
        {SETUP_STEPS.map((step) => (
          <li
            key={step.id}
            className={`flex items-center justify-between rounded-md p-3 ${
              step.status === 'current' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(step.status)}
              <span className={`text-sm ${
                step.status === 'completed' ? 'font-semibold text-gray-800 dark:text-gray-100' : 
                step.status === 'current' ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {step.status === 'current' && (
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                Skip
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetupGuide;