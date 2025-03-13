import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MessagingProvider } from "./contexts/MessagingContext";
import { FriendsProvider } from "./contexts/FriendsContext";
import { AdminProvider } from "./contexts/AdminContext";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <MessagingProvider>
          <FriendsProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </FriendsProvider>
        </MessagingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
