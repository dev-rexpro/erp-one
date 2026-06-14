import React from 'react';
import {
    REXONE_SETTINGS_SHORTCUTS,
    REXONE_SETTINGS_CATEGORIES,
    ArrowUpRightIcon
} from '../constants';

const REXOneSettingsView: React.FC = () => {
    return (
        <div className="space-y-8 rounded-lg border border-gray-200 bg-white p-8 dark:bg-gray-800 dark:border-gray-700">
            {/* Shortcuts Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Shortcuts</h2>
                <div className="mt-4 flex flex-wrap gap-x-12 gap-y-4">
                    {REXONE_SETTINGS_SHORTCUTS.map(shortcut => (
                        <a href="#" key={shortcut.id} className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                            <span>{shortcut.label}</span>
                            <ArrowUpRightIcon />
                        </a>
                    ))}
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Settings Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Settings</h2>
                <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {REXONE_SETTINGS_CATEGORIES.map(category => (
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
        </div>
    );
};

export default REXOneSettingsView;