import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import ConversationMonitoring from "./ConversationMonitoring";
import UsageMetrics from "./UsageMetrics";
import FeatureManagement from "./FeatureManagement";
import FlaggedContent from "./FlaggedContent";

interface AdminLayoutProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  defaultView?: string;
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  userName = "Admin User",
  userRole = "System Administrator",
  onLogout = () => console.log("Logout clicked"),
  defaultView = "dashboard",
  children,
}) => {
  const [currentView, setCurrentView] = useState<string>(defaultView);

  const renderContent = () => {
    switch (currentView) {
      case "conversations":
        return <ConversationMonitoring />;
      case "metrics":
        return <UsageMetrics />;
      case "features":
        return <FeatureManagement />;
      case "flagged":
        return <FlaggedContent />;
      case "dashboard":
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Quick Stats Cards */}
              <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
                <h2 className="text-lg font-medium mb-4">Platform Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-md p-3">
                    <p className="text-sm text-muted-foreground">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <div className="bg-background rounded-md p-3">
                    <p className="text-sm text-muted-foreground">
                      Messages Today
                    </p>
                    <p className="text-2xl font-bold">8,732</p>
                  </div>
                  <div className="bg-background rounded-md p-3">
                    <p className="text-sm text-muted-foreground">
                      Pending Reviews
                    </p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="bg-background rounded-md p-3">
                    <p className="text-sm text-muted-foreground">
                      System Status
                    </p>
                    <p className="text-lg font-medium text-green-500">
                      Operational
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
                <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    {
                      time: "10:23 AM",
                      event: "New flagged content detected",
                      type: "alert",
                    },
                    {
                      time: "09:45 AM",
                      event: "System update completed",
                      type: "info",
                    },
                    {
                      time: "Yesterday",
                      event: "User growth increased by 5%",
                      type: "success",
                    },
                    {
                      time: "Yesterday",
                      event: "New feature deployed",
                      type: "info",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${activity.type === "alert" ? "bg-destructive" : activity.type === "success" ? "bg-green-500" : "bg-blue-500"}`}
                      />
                      <div>
                        <p className="font-medium">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Access Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="bg-card rounded-lg shadow-sm p-4 border border-border cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setCurrentView("conversations")}
              >
                <h3 className="text-lg font-medium mb-2">
                  Conversation Monitoring
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor and analyze user conversations
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    3 flagged conversations
                  </span>
                  <button className="text-sm text-primary hover:underline">
                    View
                  </button>
                </div>
              </div>

              <div
                className="bg-card rounded-lg shadow-sm p-4 border border-border cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setCurrentView("metrics")}
              >
                <h3 className="text-lg font-medium mb-2">Usage Metrics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View platform usage statistics
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    +12% message volume
                  </span>
                  <button className="text-sm text-primary hover:underline">
                    View
                  </button>
                </div>
              </div>

              <div
                className="bg-card rounded-lg shadow-sm p-4 border border-border cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setCurrentView("features")}
              >
                <h3 className="text-lg font-medium mb-2">Feature Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Control platform features
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">8 active features</span>
                  <button className="text-sm text-primary hover:underline">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <AdminSidebar
        userName={userName}
        userRole={userRole}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">
        {children || renderContent()}
        {!children && <Outlet />}
      </div>
    </div>
  );
};

export default AdminLayout;
