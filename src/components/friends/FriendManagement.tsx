import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendSearch from "./FriendSearch";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";
import { useFriends } from "@/contexts/FriendsContext";
import { useNavigate } from "react-router-dom";

interface FriendManagementProps {
  initialTab?: string;
}

const FriendManagement = ({ initialTab = "search" }: FriendManagementProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  const {
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
  } = useFriends();

  // Refresh data when component mounts
  useEffect(() => {
    refreshFriends();
    refreshRequests();
  }, []);

  const handleSendRequest = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  const handleTogglePrivacy = async (isPrivate: boolean) => {
    try {
      await togglePrivacy(isPrivate);
    } catch (err) {
      console.error("Error updating privacy settings:", err);
    }
  };

  const handleStartConversation = async (friendId: string) => {
    try {
      const conversationId = await startConversation(friendId);
      navigate(`/app/chats`);
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(friendId);
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Friend Management
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="search">Find Friends</TabsTrigger>
            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
            <TabsTrigger value="friends">My Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-2">
            <FriendSearch
              onSendRequest={handleSendRequest}
              onTogglePrivacy={handleTogglePrivacy}
              onSearch={searchUsers}
              searchResults={searchResults}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="requests" className="mt-2">
            <FriendRequests
              requests={requests}
              onAccept={acceptFriendRequest}
              onDecline={declineFriendRequest}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="friends" className="mt-2">
            <FriendsList
              friends={friends}
              onStartConversation={handleStartConversation}
              onRemoveFriend={handleRemoveFriend}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FriendManagement;
