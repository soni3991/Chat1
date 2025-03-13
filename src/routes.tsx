import { lazy, Suspense } from "react";
import { Route, Routes, Navigate, useRoutes } from "react-router-dom";
import Home from "./components/home";
import ProtectedRoute from "./components/ProtectedRoute";
import routes from "tempo-routes";

// Lazy load components for better performance
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const ChatContainer = lazy(
  () => import("./components/messaging/ChatContainer"),
);
const FriendManagement = lazy(
  () => import("./components/friends/FriendManagement"),
);
const ProfileSettings = lazy(
  () => import("./components/settings/ProfileSettings"),
);
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));

export default function AppRoutes() {
  // Render tempo routes if available
  const tempoRoutesElement = import.meta.env.VITE_TEMPO && useRoutes(routes);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <>
        {import.meta.env.VITE_TEMPO && tempoRoutesElement}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="chats" element={<ChatContainer />} />
            <Route path="friends" element={<FriendManagement />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route index element={<Navigate to="/app/chats" replace />} />
          </Route>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add this before the catchall route for Tempo */}
          {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    </Suspense>
  );
}
