import { useState } from "react";
import {
  Bell,
  Menu,
  User as UserIcon,
  Key,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Theme state logic
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <header className="h-16 border-b border-border/50 glass-strong flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="relative w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="Toggle Light/Dark Mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user?.role === "superadmin" ? (
          <button
            type="button"
            onClick={() => navigate("/admin/logs")}
            className="relative w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Audit logs"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-primary" />
          </button>
        ) : null}

        <div className="pl-3 border-l border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none cursor-pointer">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground hover:text-primary transition-colors">
                {user?.name || "Trader"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 glass mt-2 border-border/50"
            >
              <DropdownMenuLabel className="font-normal border-b border-border/50 pb-3 mb-1">
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {user?.name || "Akhtar ali"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "akhyshaikh12@gmail.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer py-2.5 mt-1 hover:bg-accent/60"
              >
                <UserIcon className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer py-2.5 hover:bg-accent/60"
              >
                <Key className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50 my-1" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive py-2.5 hover:bg-destructive/10"
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
