import React from 'react';
import SetupGuide from './SetupGuide';
import ProfitAndLossChart from './ProfitAndLossChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AccountingDashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <SetupGuide />
        </div>
        <div className="lg:col-span-1">
          <Card className="rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account Settings</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    In ERPNext, Accounting features are configurable as per your business needs. Accounts Settings is the place to define some of your accounting preferences like:
                </p>
                <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Credit Limit and over billing settings</li>
                    <li>Taxation preferences</li>
                    <li>Deferred accounting preferences</li>
                </ul>
                <Button variant="outline" className="mt-6">
                    Take a quick walk-through of Accounts Settings
                </Button>
            </Card>
        </div>
      </div>
      
      <ProfitAndLossChart />
    </>
  );
};

export default AccountingDashboard;