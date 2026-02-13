import React from 'react';
import { useApp } from '../contexts/AppContext';

const Financials = () => {
  const { financials } = useApp();

  return (
    <div>
        <h2 className="text-2xl font-bold text-peregrine-900 dark:text-white mb-6">Financial Records</h2>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Description</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Category</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {financials.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{record.date}</td>
                                <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">{record.description}</td>
                                <td className="p-4 text-sm text-slate-500">
                                    <span className="bg-slate-100 dark:bg-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs">
                                        {record.category}
                                    </span>
                                </td>
                                <td className={`p-4 text-sm font-bold text-right ${record.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {record.type === 'income' ? '+' : '-'} ₱{record.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Financials;