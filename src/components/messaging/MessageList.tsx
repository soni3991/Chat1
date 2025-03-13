import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CheckCheck, Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  isCurrentUser: boolean;
  media?: {
    type: "image" | "video" | "file";
    url: string;
    name?: string;
    size?: number;
  }[];
}

interface MessageListProps {
  messages?: Message[];
  currentUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages = [
    {
      id: "1",
      content: "Hey there! How's it going?",
      sender: {
        id: "user2",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "read",
      isCurrentUser: false,
    },
    {
      id: "2",
      content:
        "I'm doing well, thanks for asking! Just working on that new project we discussed.",
      sender: {
        id: "user1",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
      status: "delivered",
      isCurrentUser: true,
    },
    {
      id: "3",
      content:
        "That sounds great! Would love to see some progress pics when you get a chance.",
      sender: {
        id: "user2",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      timestamp: new Date(Date.now() - 3400000), // 56 minutes ago
      status: "read",
      isCurrentUser: false,
    },
    {
      id: "4",
      content: "Sure thing! Here's what I've been working on so far.",
      sender: {
        id: "user1",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      timestamp: new Date(Date.now() - 3300000), // 55 minutes ago
      status: "sent",
      isCurrentUser: true,
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
          name: "project_preview.jpg",
          size: 1240000,
        },
      ],
    },
    {
      id: "5",
      content: "Wow, that looks amazing! You've made a lot of progress.",
      sender: {
        id: "user2",
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: "read",
      isCurrentUser: false,
    },
  ],
  currentUserId = "user1",
}) => {
  // Format timestamp to display time in a readable format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format file size to display in a readable format
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Render message status indicator
  const renderMessageStatus = (status: Message["status"]) => {
    switch (status) {
      case "read":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CheckCheck className="h-4 w-4 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Read</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "delivered":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CheckCheck className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delivered</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "sent":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Clock className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sent</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"} max-w-[80%] items-end gap-2`}
          >
            {!message.isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={message.sender.avatar}
                  alt={message.sender.name}
                />
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <div
                className={`rounded-lg p-3 ${
                  message.isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}
              >
                {message.content}
                {message.media && message.media.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.media.map((item, index) => (
                      <div key={index} className="rounded-md overflow-hidden">
                        {item.type === "image" && (
                          <div className="relative">
                            <img
                              src={item.url}
                              alt={item.name || "Image"}
                              className="max-w-full rounded-md"
                            />
                            {item.name && (
                              <div className="text-xs mt-1 flex justify-between">
                                <span>{item.name}</span>
                                {item.size && (
                                  <span>{formatFileSize(item.size)}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {item.type === "video" && (
                          <div className="relative">
                            <video
                              src={item.url}
                              controls
                              className="max-w-full rounded-md"
                            />
                            {item.name && (
                              <div className="text-xs mt-1 flex justify-between">
                                <span>{item.name}</span>
                                {item.size && (
                                  <span>{formatFileSize(item.size)}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {item.type === "file" && (
                          <div className="bg-gray-100 p-2 rounded-md flex items-center justify-between">
                            <span>{item.name || "File"}</span>
                            {item.size && (
                              <span className="text-xs">
                                {formatFileSize(item.size)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={`flex items-center text-xs text-gray-500 mt-1 ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <span>{formatTime(message.timestamp)}</span>
                {message.isCurrentUser && (
                  <span className="ml-1">
                    {renderMessageStatus(message.status)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
