import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  MessageSquare,
  MoreHorizontal,
  UserMinus,
  UserPlus,
} from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

interface FriendsListProps {
  friends?: Friend[];
  onStartConversation?: (friendId: string) => void;
  onRemoveFriend?: (friendId: string) => void;
}

const FriendsList = ({
  friends = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      status: "online",
    },
    {
      id: "2",
      name: "Sam Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      status: "offline",
      lastSeen: "2 hours ago",
    },
    {
      id: "3",
      name: "Taylor Swift",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
      status: "busy",
    },
    {
      id: "4",
      name: "Jordan Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      status: "away",
      lastSeen: "5 minutes ago",
    },
    {
      id: "5",
      name: "Casey Morgan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
      status: "online",
    },
  ],
  onStartConversation = () => {},
  onRemoveFriend = () => {},
}: FriendsListProps) => {
  const getStatusColor = (status: Friend["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === "offline" && friend.lastSeen) {
      return `Last seen ${friend.lastSeen}`;
    }
    return friend.status;
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Friends ({friends.length})
      </h2>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <UserPlus size={48} className="mb-2" />
          <p>No friends yet. Start by adding some friends!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>
                      {friend.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(friend.status)}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {friend.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getStatusText(friend)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {friend.status === "online" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    Online
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStartConversation(friend.id)}
                  title="Start conversation"
                >
                  <MessageSquare
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFriend(friend.id)}
                  title="Remove friend"
                >
                  <UserMinus
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
