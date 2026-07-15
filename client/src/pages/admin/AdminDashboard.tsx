import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        This is a placeholder admin page to verify RBAC implementation.
      </p>
    </div>
  );
};
