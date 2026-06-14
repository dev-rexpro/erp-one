
import React from 'react';
import { 
    RECEIVABLES_SHORTCUTS, 
    RECEIVABLES_REPORTS_MASTERS_MAIN, 
    RECEIVABLES_REPORTS_MASTERS_REPORTS_ONLY, 
    ArrowUpRightIcon 
} from '../constants';

const ReceivablesView: React.FC = () => {
  return (
    <div className="space-y-8 rounded-lg border border-gray-200 bg-white p-8 dark:bg-gray-800 dark:border-gray-700">
      {/* Shortcuts Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shortcuts</h2>
        <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-4 md:grid-cols-4">
          {RECEIVABLES_SHORTCUTS.map(shortcut => (
            <a href="#" key={shortcut.id} className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
              <span>{shortcut.label}</span>
              <ArrowUpRightIcon />
              {shortcut.count && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {shortcut.count}
                  </span>
              )}
            </a>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Reports & Masters Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Reports & Masters</h2>
        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-3">
          {RECEIVABLES_REPORTS_MASTERS_MAIN.map(category => (
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

      {/* Reports Only Section */}
      {RECEIVABLES_REPORTS_MASTERS_REPORTS_ONLY && (
        <div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">{RECEIVABLES_REPORTS_MASTERS_REPORTS_ONLY.title}</h3>
                    <ul className="mt-3 space-y-2">
                        {RECEIVABLES_REPORTS_MASTERS_REPORTS_ONLY.links.map(link => (
                        <li key={link.id}>
                            <a href="#" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                            <span>{link.label}</span>
                            <ArrowUpRightIcon />
                            </a>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ReceivablesView;