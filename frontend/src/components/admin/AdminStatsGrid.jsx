import React from 'react';

const AdminStatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`p-6 rounded-[2rem] shadow-xl ${
            stat.bgClass || 'bg-white shadow-gray-200/40 border border-gray-100'
          } ${stat.textClass || ''}`}
        >
          <div className={`${stat.labelClass || 'text-gray-400'} text-xs font-bold uppercase tracking-widest mb-2`}>
            {stat.label}
          </div>
          <div className={`text-4xl font-bold ${stat.valueClass || 'text-[#003366]'}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsGrid;
