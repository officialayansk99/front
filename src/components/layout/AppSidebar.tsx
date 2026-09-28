import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  BarChart3,
  Users,
  FileText,
  Settings,
  Download,
  Handshake,
  User,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Landmark,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const navigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    label: "Funds",
    icon: Wallet,
    children: [
      { label: "Deposit", path: "/funds/deposit", icon: ArrowDownToLine },
      { label: "Withdrawal", path: "/funds/withdrawal", icon: ArrowUpFromLine },
      { label: "History", path: "/funds/history", icon: History },
    ],
  },
  {
    label: "Trading",
    icon: BarChart3,
    children: [
      { label: "My Accounts", path: "/trading/accounts", icon: Users },
      { label: "Downloads", path: "/trading/downloads", icon: Download },
    ],
  },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Instructions", icon: BookOpen, path: "/instructions" },
];

const adminNavigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  {
    label: "User Management",
    icon: Users,
    children: [
      { label: "Clients List", path: "/admin/clients", icon: User },
      { label: "Plans", path: "/admin/plans", icon: BookOpen },
    ],
  },
  {
    label: "Email Configuration",
    icon: FileText,
    children: [
      { label: "SMTP Settings", path: "/admin/smtp", icon: Settings },
      { label: "Emailers", path: "/admin/emailers", icon: FileText },
    ],
  },
  {
    label: "System Settings",
    icon: Settings,
    children: [
      {
        label: "Representatives",
        path: "/admin/representatives",
        icon: Handshake,
      },
      { label: "Audit Logs", path: "/admin/logs", icon: History },
    ],
  },
  { label: "Accounts", icon: Users, path: "/admin/mt5-accounts" },
  {
    label: "Funds",
    icon: Wallet,
    children: [
      { label: "Transactions", path: "/admin/transactions", icon: History },
      {
        label: "Deposit bank / QR",
        path: "/admin/deposit-instructions",
        icon: Landmark,
      },
    ],
  },
];

export default function AppSidebar({
  collapsed,
  onToggle,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const currentNavigation =
    user?.role === "superadmin" ? adminNavigation : navigation;

  const [openGroups, setOpenGroups] = useState<string[]>(["Funds", "Trading"]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  };

  const isActive = (path?: string) =>
    path ? location.pathname === path : false;
  const isGroupActive = (children?: NavItem["children"]) =>
    children?.some((c) => location.pathname === c.path);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "h-20 relative flex items-center border-b border-sidebar-border shrink-0 transition-all duration-300",
            collapsed ? "px-3 justify-center" : "px-5",
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Logo
              className={cn(
                "h-14 w-auto transition-all duration-300",
                collapsed ? "h-10" : "",
              )}
            />
          </div>
          <button
            onClick={onToggle}
            className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border hidden lg:flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-50 shadow-sm"
          >
            <ChevronLeft
              size={14}
              className={cn("transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {currentNavigation.map((item) => (
            <div key={item.label}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) onCloseMobile();
                  }}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (collapsed) {
                        onToggle();
                        if (!openGroups.includes(item.label)) {
                          toggleGroup(item.label);
                        }
                      } else {
                        toggleGroup(item.label);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                      isGroupActive(item.children)
                        ? "text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                    )}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform",
                            openGroups.includes(item.label) && "rotate-180",
                          )}
                        />
                      </>
                    )}
                  </button>
                  <AnimatePresence>
                    {!collapsed && openGroups.includes(item.label) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-3 border-l border-sidebar-border space-y-0.5 py-1">
                          {item.children?.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                isActive(child.path)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                              )}
                              onClick={() => {
                                if (window.innerWidth < 1024) onCloseMobile();
                              }}
                            >
                              <child.icon size={15} className="shrink-0" />
                              <span>{child.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* User section */}
        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
