import React, { createContext, useContext, useState, useEffect } from "react";
import { adminService } from "@/services/api";
import { FeatureToggle, ConversationData, FlaggedMessage } from "@/types";
import { useAuth } from "./AuthContext";

interface AdminContextType {
  features: FeatureToggle[];
  conversations: ConversationData[];
  flaggedContent: FlaggedMessage[];
  usageMetrics: any; // This would be typed according to your metrics structure
  isLoading: boolean;
  error: string | null;
  toggleFeature: (featureId: string, enabled: boolean) => Promise<void>;
  refreshFeatures: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  refreshFlaggedContent: () => Promise<void>;
  refreshUsageMetrics: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [flaggedContent, setFlaggedContent] = useState<FlaggedMessage[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load admin data when user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      refreshFeatures();
      refreshConversations();
      refreshFlaggedContent();
      refreshUsageMetrics();
    } else {
      setFeatures([]);
      setConversations([]);
      setFlaggedContent([]);
      setUsageMetrics(null);
      setIsLoading(false);
    }
  }, [user]);

  const refreshFeatures = async () => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      const featuresData = await adminService.getFeatures();
      setFeatures(featuresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load features");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshConversations = async () => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      const conversationsData = await adminService.getConversationData();
      setConversations(conversationsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFlaggedContent = async () => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      const flaggedData = await adminService.getFlaggedContent();
      setFlaggedContent(flaggedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load flagged content",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsageMetrics = async () => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      const metricsData = await adminService.getUsageMetrics();
      setUsageMetrics(metricsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load usage metrics",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = async (featureId: string, enabled: boolean) => {
    if (!user || user.role !== "admin") return;

    setIsLoading(true);
    setError(null);

    try {
      await adminService.toggleFeature(featureId, enabled);
      await refreshFeatures();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle feature");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    features,
    conversations,
    flaggedContent,
    usageMetrics,
    isLoading,
    error,
    toggleFeature,
    refreshFeatures,
    refreshConversations,
    refreshFlaggedContent,
    refreshUsageMetrics,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
