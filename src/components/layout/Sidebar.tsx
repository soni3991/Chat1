import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Switch } from "../ui/switch";

interface SidebarProps {
  onLogout?: () => void;
  userName?: string;
  userAvatar?: string;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Sidebar = ({
  onLogout = () => console.log("Logout clicked"),
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  darkMode = false,
  onToggleDarkMode = () => console.log("Toggle dark mode"),
}: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/app/chats", icon: <MessageSquare size={24} />, label: "Chats" },
    { path: "/app/friends", icon: <Users size={24} />, label: "Friends" },
    { path: "/app/settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  const isAdmin = userName.toLowerCase().includes("admin");

  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* App Logo/Title */}
        <div className="flex items-center justify-center py-4">
          <h1 className="text-2xl font-bold text-primary">SecureChat</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant={
                  currentPath.startsWith(item.path) ? "default" : "ghost"
                }
                className="w-full justify-start gap-3 py-6"
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}

          {isAdmin && (
            <Link to="/admin">
              <Button
                variant={currentPath.startsWith("/admin") ? "default" : "ghost"}
                className="w-full justify-start gap-3 py-6"
              >
                <Shield size={24} />
                <span>Admin Panel</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>

      {/* User Section */}
      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm">Dark Mode</span>
          </div>
          <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onLogout}>
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
