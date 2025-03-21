// app/dashboard/page.tsx
import React, { Suspense } from 'react';
import DashboardPage from './DashboardPage';

const Page = () => {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading dashboard...</div>}>
      <DashboardPage />
    </Suspense>
  );
};

export default Page;
