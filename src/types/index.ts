export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface Message {
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

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    lastSeen?: string;
  };
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: {
    id: string;
    content: string;
    timestamp: string;
    status: "sent" | "delivered" | "read";
    isUnread: boolean;
  };
  unreadCount: number;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    status?: "online" | "offline" | "away";
    lastSeen?: Date;
  };
  messages?: Message[];
}

export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "security" | "messaging" | "users" | "notifications";
}

export interface ConversationData {
  id: string;
  participants: string[];
  lastActive: string;
  messageCount: number;
  flaggedCount: number;
}

export interface FlaggedMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  severity: "low" | "medium" | "high";
}
