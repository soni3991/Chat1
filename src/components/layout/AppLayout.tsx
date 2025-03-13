import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  onLogout = () => console.log("Logout clicked"),
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const location = useLocation();

  // Effect to apply dark mode to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userAvatar={userAvatar}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
