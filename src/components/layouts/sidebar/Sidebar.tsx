"use client";

import { usePathname } from "next/navigation";

import { useSidebar } from "@/hooks/useSidebar";

import { cn } from "@/utils/tw-merge";

import DashboardNav from "./DashboardNav";
import SidebarHeader from "./SidebarHeader";
import UserNav from "./UserNav";

const Sidebar = () => {
  const { isCollapsed } = useSidebar();

  const pathname = usePathname();

  const isDashboardPage = pathname.includes("/dashboard");

  return (
    <aside
      className={cn(
        "border-border bg-card fixed left-0 z-50 mt-[75px] flex h-full flex-col border-r transition-all duration-100 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarHeader />
      {isDashboardPage ? <DashboardNav /> : <UserNav />}
    </aside>
  );
};

export default Sidebar;
