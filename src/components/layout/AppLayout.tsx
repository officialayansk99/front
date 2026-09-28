import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // Ensure mobile sidebar backdrop is cleared after every navigation.
    if (window.innerWidth < 1024) {
      window.requestAnimationFrame(() => setCollapsed(true));
    }
  }, [location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background flex relative overflow-x-hidden">
      {/* Landing-style background effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        onCloseMobile={() => setCollapsed(true)}
      />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 relative z-10",
          collapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <Navbar onMenuClick={() => setCollapsed(false)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
