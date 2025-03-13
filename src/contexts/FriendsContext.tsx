import React, { createContext, useContext, useState, useEffect } from "react";
import { friendService } from "@/services/api";
import { Friend, FriendRequest } from "@/types";
import { useAuth } from "./AuthContext";
import { useMessaging } from "./MessagingContext";

interface FriendsContextType {
  friends: Friend[];
  requests: {
    incoming: FriendRequest[];
    outgoing: FriendRequest[];
  };
  searchResults: Friend[];
  isLoading: boolean;
  error: string | null;
  searchUsers: (query: string) => Promise<void>;
  sendFriendRequest: (userId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  togglePrivacy: (isPrivate: boolean) => Promise<void>;
  startConversation: (friendId: string) => Promise<string>;
  refreshFriends: () => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
};

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { createConversation } = useMessaging();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<{
    incoming: FriendRequest[];
    outgoing: FriendRequest[];
  }>({
    incoming: [],
    outgoing: [],
  });
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load friends when user changes
  useEffect(() => {
    if (user) {
      refreshFriends();
      refreshRequests();
    } else {
      setFriends([]);
      setRequests({ incoming: [], outgoing: [] });
      setIsLoading(false);
    }
  }, [user]);

  const refreshFriends = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const userFriends = await friendService.getFriends(user.id);
      setFriends(userFriends);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRequests = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const friendRequests = await friendService.getFriendRequests(user.id);
      setRequests(friendRequests);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load friend requests",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!user || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await friendService.searchUsers(query, user.id);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search users");
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await friendService.sendFriendRequest(user.id, userId);
      await refreshRequests();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send friend request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await friendService.acceptFriendRequest(requestId, user.id);
      await refreshRequests();
      await refreshFriends();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept friend request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await friendService.declineFriendRequest(requestId, user.id);
      await refreshRequests();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to decline friend request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await friendService.removeFriend(user.id, friendId);
      await refreshFriends();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove friend");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePrivacy = async (isPrivate: boolean) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await friendService.togglePrivacy(user.id, isPrivate);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update privacy settings",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async (friendId: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      return await createConversation(friendId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start conversation",
      );
      throw err;
    }
  };

  const value = {
    friends,
    requests,
    searchResults,
    isLoading,
    error,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    togglePrivacy,
    startConversation,
    refreshFriends,
    refreshRequests,
  };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};
