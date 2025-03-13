import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContainer from "./auth/AuthContainer";
import AppLayout from "./layout/AppLayout";

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Simulate checking for existing session
  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const checkAuthStatus = () => {
      const savedAuthStatus = localStorage.getItem("isAuthenticated");
      if (savedAuthStatus === "true") {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    // Add a small delay to simulate checking auth status
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthentication = () => {
    // Save authentication state
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    navigate("/app/chats");
  };

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading secure messaging...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {isAuthenticated ? (
        <AppLayout
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          onLogout={handleLogout}
        />
      ) : (
        <div className="h-screen w-full flex items-center justify-center">
          <AuthContainer onAuthenticated={handleAuthentication} />
        </div>
      )}
    </div>
  );
};

export default Home;
