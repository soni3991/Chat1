import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ConversationView from "./ConversationView";
import { useMessaging } from "@/contexts/MessagingContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";

const ChatContainer: React.FC = () => {
  const { user } = useAuth();
  const {
    chats,
    conversations,
    selectedChatId,
    selectChat,
    sendMessage,
    attachMedia,
    refreshChats,
  } = useMessaging();

  const [isMobileView, setIsMobileView] = useState<boolean>(
    window.innerWidth < 768,
  );

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Refresh chats when component mounts
  useEffect(() => {
    if (user) {
      refreshChats();
    }
  }, [user, refreshChats]);

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
  };

  const handleBack = () => {
    selectChat("");
  };

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      await sendMessage(message);
    }
  };

  const handleAttachMedia = async (file: File) => {
    await attachMedia(file);
  };

  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Chat List - hide on mobile when a chat is selected */}
      <div
        className={`${isMobileView && selectedChatId ? "hidden" : "block"} w-full md:w-80 md:flex-shrink-0 h-full`}
      >
        <ChatList
          chats={chats}
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChatId}
        />
      </div>

      {/* Conversation View - show on mobile only when a chat is selected */}
      <div
        className={`${isMobileView && !selectedChatId ? "hidden" : "block"} flex-1 h-full`}
      >
        {selectedChatId && conversations[selectedChatId] ? (
          <ConversationView
            conversation={conversations[selectedChatId]}
            onSendMessage={handleSendMessage}
            onAttachMedia={handleAttachMedia}
            onBack={handleBack}
            currentUserId={user?.id || ""}
          />
        ) : (
          <div className="hidden md:flex h-full items-center justify-center bg-white">
            <div className="text-center p-8">
              <div className="flex justify-center mb-4">
                <MessageSquare className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
