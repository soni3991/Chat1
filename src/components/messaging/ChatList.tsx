import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Check, Clock, MessageSquare, Search } from "lucide-react";
import { Chat } from "@/types";
import { Button } from "../ui/button";
import { useFriends } from "@/contexts/FriendsContext";
import { useMessaging } from "@/contexts/MessagingContext";
import { useNavigate } from "react-router-dom";

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chatId: string) => void;
  selectedChatId: string;
}

const ChatList: React.FC<ChatListProps> = ({
  chats = [],
  onChatSelect,
  selectedChatId = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { friends } = useFriends();
  const { createConversation } = useMessaging();
  const navigate = useNavigate();

  const filteredChats = searchTerm
    ? chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    : chats;

  const handleNewConversation = () => {
    // Navigate to friends page to start a new conversation
    navigate("/app/friends");
  };
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <div className="mt-2 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-2.5 top-3 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChatId === chat.id ? "bg-blue-50" : ""}`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex items-start">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>
                    {chat.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium text-gray-900">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.lastMessage.timestamp}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p
                    className={`text-sm ${chat.lastMessage.isUnread ? "font-medium text-gray-900" : "text-gray-500"} truncate max-w-[200px]`}
                  >
                    {chat.lastMessage.content}
                  </p>
                  <div className="flex items-center">
                    {chat.lastMessage.status === "sent" && (
                      <Clock className="h-3 w-3 text-gray-400" />
                    )}
                    {chat.lastMessage.status === "delivered" && (
                      <Check className="h-3 w-3 text-gray-400" />
                    )}
                    {chat.lastMessage.status === "read" && (
                      <div className="flex">
                        <Check className="h-3 w-3 text-blue-500" />
                        <Check className="h-3 w-3 text-blue-500 -ml-1" />
                      </div>
                    )}
                    {chat.unreadCount > 0 && (
                      <Badge className="ml-2 bg-blue-500 text-white">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full flex items-center justify-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => {}}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          New Conversation
        </button>
      </div>
    </div>
  );
};

export default ChatList;
