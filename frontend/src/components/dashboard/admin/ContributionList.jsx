import React from 'react';

const ContributionList = ({ title, items = [], totalValue = 0, icon, colorClass = "bg-[#003366]" }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="p-2 bg-gray-100 rounded-lg text-sm">{icon}</span> {title}
                </h3>
            </div>

            <div className="space-y-5">
                {items.length > 0 ? (
                    items.map((item, idx) => {
                        const percentage = totalValue > 0 ? (item.revenue / totalValue) * 100 : 0;
                        return (
                            <div key={item.id || idx} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-700 truncate max-w-[180px]">{item.title}</span>
                                    <span className="font-black text-gray-900">₹{item.revenue?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 text-right uppercase tracking-widest">
                                    {percentage.toFixed(1)}% Contribution
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-gray-400 text-sm italic">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContributionList;
