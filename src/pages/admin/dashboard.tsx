import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

interface AdminDashboardProps {
  userName?: string;
  userRole?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName = "Admin User",
  userRole = "System Administrator",
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real implementation, this would handle authentication logout
    console.log("Logging out...");
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminLayout
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
        defaultView="dashboard"
      />
    </div>
  );
};

export default AdminDashboard;
