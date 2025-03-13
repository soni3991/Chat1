import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Phone, Video, Info, MoreVertical, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ConversationViewProps {
  conversation?: {
    id: string;
    recipient: {
      id: string;
      name: string;
      avatar?: string;
      status?: "online" | "offline" | "away";
      lastSeen?: Date;
    };
    messages?: Array<{
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
    }>;
  };
  onSendMessage?: (message: string) => void;
  onAttachMedia?: (file: File) => void;
  onBack?: () => void;
  currentUserId?: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation = {
    id: "conv1",
    recipient: {
      id: "user2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      status: "online",
      lastSeen: new Date(),
    },
    messages: [
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
  },
  onSendMessage = () => {},
  onAttachMedia = () => {},
  onBack = () => {},
  currentUserId = "user1",
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      // Randomly show typing indicator for demo purposes
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 5000);

    return () => clearTimeout(typingTimeout);
  }, [conversation.messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isTyping]);

  // Format last seen time
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Conversation Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage
              src={conversation.recipient.avatar}
              alt={conversation.recipient.name}
            />
            <AvatarFallback>
              {conversation.recipient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h3 className="font-medium">{conversation.recipient.name}</h3>
            <span className="text-xs text-gray-500">
              {conversation.recipient.status === "online" ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  Online
                </span>
              ) : (
                `Last seen ${formatLastSeen(conversation.recipient.lastSeen || new Date())}`
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Conversation info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          messages={conversation.messages}
          currentUserId={currentUserId}
        />

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 px-4 py-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={conversation.recipient.avatar}
                alt={conversation.recipient.name}
              />
              <AvatarFallback>
                {conversation.recipient.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-200 rounded-full px-3 py-2">
              <div className="flex space-x-1">
                <div
                  className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onAttachMedia={onAttachMedia}
        placeholder="Type a message..."
      />
    </div>
  );
};

export default ConversationView;
