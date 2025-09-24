import React from 'react';

const TaskStats = ({ stats, className = '' }) => {
  const statItems = [
    {
      label: 'En cours',
      value: stats.EN_COURS || 0,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Terminé',
      value: stats.TERMINER || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {statItems.map((stat, index) => (
        <div key={index} className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-2xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-white/90 font-medium">{stat.label}</div>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
              <div className={stat.textColor}>
                {stat.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;