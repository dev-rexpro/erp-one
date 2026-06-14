import React, { useState, useCallback } from 'react';
import { getBusinessInsights } from '../services/geminiService';
import { SparklesIcon } from '../constants';

const AIEnhancedInsight: React.FC = () => {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsight = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setInsight('');
    try {
      const result = await getBusinessInsights();
      setInsight(result);
    } catch (err) {
      setError('Failed to generate insights. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const formatInsight = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 text-gray-600 dark:text-gray-300">{line.substring(2)}</li>;
      }
      if (line.trim().length === 0) {
        return <br key={index} />;
      }
      return <p key={index} className="text-gray-700 dark:text-gray-200">{line}</p>;
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI-Powered Business Insight</h3>
        </div>
        <button
          onClick={handleGenerateInsight}
          disabled={isLoading}
          className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             'Generate Insight'
          )}
        </button>
      </div>

      <div className="mt-4 min-h-[6rem] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:bg-gray-700/50 dark:border-gray-600">
        {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Generating financial insights with Gemini...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {insight && <ul className="space-y-2 list-disc">{formatInsight(insight)}</ul>}
        {!isLoading && !error && !insight && <p className="text-center text-gray-500 dark:text-gray-400">Click "Generate Insight" to get AI-powered analysis of your business performance.</p>}
      </div>
    </div>
  );
};

export default AIEnhancedInsight;