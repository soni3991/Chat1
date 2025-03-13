import React, { createContext, useContext, useState, useEffect } from "react";
import { messageService } from "@/services/api";
import { Chat, Conversation, Message } from "@/types";
import { useAuth } from "./AuthContext";

interface MessagingContextType {
  chats: Chat[];
  conversations: Record<string, Conversation>;
  selectedChatId: string;
  isLoading: boolean;
  error: string | null;
  selectChat: (chatId: string) => void;
  sendMessage: (message: string) => Promise<void>;
  attachMedia: (file: File) => Promise<void>;
  createConversation: (recipientId: string) => Promise<string>;
  refreshChats: () => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({});
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load chats when user changes
  useEffect(() => {
    if (user) {
      refreshChats();
    } else {
      setChats([]);
      setConversations({});
      setSelectedChatId("");
      setIsLoading(false);
    }
  }, [user]);

  // Load conversation when selected chat changes
  useEffect(() => {
    if (selectedChatId && user) {
      loadConversation(selectedChatId);
    }
  }, [selectedChatId, user]);

  const refreshChats = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const userChats = await messageService.getConversations(user.id);
      setChats(userChats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (chatId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const conversation = await messageService.getConversation(
        chatId,
        user.id,
      );
      setConversations((prev) => ({
        ...prev,
        [chatId]: conversation,
      }));

      // Update unread count in chats list
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversation",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const sendMessage = async (message: string) => {
    if (!user || !selectedChatId) return;

    try {
      const newMessage = await messageService.sendMessage(
        selectedChatId,
        message,
        user.id,
      );

      // Update conversations state
      setConversations((prev) => {
        const conversation = prev[selectedChatId];
        if (!conversation) return prev;

        return {
          ...prev,
          [selectedChatId]: {
            ...conversation,
            messages: [...(conversation.messages || []), newMessage],
          },
        };
      });

      // Update chats list with new last message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: {
                  id: newMessage.id,
                  content: newMessage.content,
                  timestamp: newMessage.timestamp.toLocaleString(),
                  status: newMessage.status,
                  isUnread: false,
                },
              }
            : chat,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const attachMedia = async (file: File) => {
    if (!user || !selectedChatId) return;

    try {
      const newMessage = await messageService.attachMedia(
        selectedChatId,
        user.id,
        file,
      );

      // Update conversations state
      setConversations((prev) => {
        const conversation = prev[selectedChatId];
        if (!conversation) return prev;

        return {
          ...prev,
          [selectedChatId]: {
            ...conversation,
            messages: [...(conversation.messages || []), newMessage],
          },
        };
      });

      // Update chats list with new last message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: {
                  id: newMessage.id,
                  content: newMessage.content,
                  timestamp: newMessage.timestamp.toLocaleString(),
                  status: newMessage.status,
                  isUnread: false,
                },
              }
            : chat,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to attach media");
    }
  };

  const createConversation = async (recipientId: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const conversationId = await messageService.createConversation(
        user.id,
        recipientId,
      );
      await refreshChats();
      return conversationId;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create conversation",
      );
      throw err;
    }
  };

  const value = {
    chats,
    conversations,
    selectedChatId,
    isLoading,
    error,
    selectChat,
    sendMessage,
    attachMedia,
    createConversation,
    refreshChats,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
