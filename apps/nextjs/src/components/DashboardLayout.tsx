import React from "react";

import SidebarDashboard from "./SidebarDashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
  items: {
    href: string;
    title: string;
  }[];
}
const DashboardLayout = ({ children, items }: DashboardLayoutProps) => {
  return (
    <main className="grid grid-cols-1 gap-10 p-5 lg:grid-cols-[min-content_minmax(0,1fr)]  lg:p-10">
      <aside>
        <SidebarDashboard items={items} />
      </aside>
      <div className=" bg-background p-5 md:rounded-lg md:shadow-lg">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
