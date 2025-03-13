import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  MessageSquare,
  Flag,
  Settings,
  LogOut,
  Home,
  AlertTriangle,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
}

const NavItem = ({ icon, label, path, active = false }: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={path}>
            <Button
              variant={active ? "default" : "ghost"}
              size="icon"
              className={`w-full justify-start mb-2 ${active ? "bg-primary" : "bg-transparent"}`}
            >
              <div className="flex items-center w-full">
                <div className="mr-3">{icon}</div>
                <span>{label}</span>
              </div>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface AdminSidebarProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const AdminSidebar = ({
  userName = "Admin User",
  userRole = "System Administrator",
  onLogout = () => console.log("Logout clicked"),
}: AdminSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-[280px] h-full bg-card border-r border-border flex flex-col p-4">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
          {userName.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-sm">{userName}</h3>
          <p className="text-xs text-muted-foreground">{userRole}</p>
        </div>
      </div>

      <div className="flex-1">
        <NavItem
          icon={<Home size={20} />}
          label="Dashboard"
          path="/admin"
          active={currentPath === "/admin"}
        />
        <NavItem
          icon={<MessageSquare size={20} />}
          label="Conversation Monitoring"
          path="/admin/conversations"
          active={currentPath === "/admin/conversations"}
        />
        <NavItem
          icon={<BarChart3 size={20} />}
          label="Usage Metrics"
          path="/admin/metrics"
          active={currentPath === "/admin/metrics"}
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Feature Management"
          path="/admin/features"
          active={currentPath === "/admin/features"}
        />
        <NavItem
          icon={<Flag size={20} />}
          label="Flagged Content"
          path="/admin/flagged"
          active={currentPath === "/admin/flagged"}
        />
        <NavItem
          icon={<AlertTriangle size={20} />}
          label="Security Alerts"
          path="/admin/security"
          active={currentPath === "/admin/security"}
        />
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
