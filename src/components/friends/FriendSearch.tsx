import React, { useState } from "react";
import { Search, UserPlus, Shield, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FriendSearchProps {
  onSendRequest?: (userId: string) => void;
  onTogglePrivacy?: (isPrivate: boolean) => void;
}

interface UserResult {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  mutualFriends: number;
  isVerified: boolean;
}

const FriendSearch = ({
  onSendRequest = () => {},
  onTogglePrivacy = () => {},
}: FriendSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchResults, setSearchResults] = useState<UserResult[]>([
    {
      id: "1",
      name: "Alex Johnson",
      username: "alexj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      mutualFriends: 5,
      isVerified: true,
    },
    {
      id: "2",
      name: "Samantha Lee",
      username: "samlee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=samantha",
      mutualFriends: 2,
      isVerified: false,
    },
    {
      id: "3",
      name: "Michael Chen",
      username: "mikechen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      mutualFriends: 8,
      isVerified: true,
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to search for users
    console.log("Searching for:", searchQuery);
    // Mock implementation - filter existing results
    const filteredResults = searchResults.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(
      filteredResults.length > 0 ? filteredResults : searchResults,
    );
  };

  const togglePrivacy = () => {
    const newPrivacyState = !isPrivate;
    setIsPrivate(newPrivacyState);
    onTogglePrivacy(newPrivacyState);
  };

  const handleSendRequest = (userId: string) => {
    onSendRequest(userId);
    // In a real implementation, this would call an API to send a friend request
    console.log("Sending friend request to user ID:", userId);
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Find Friends
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePrivacy}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isPrivate ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isPrivate
                  ? "Your profile is hidden from search"
                  : "Your profile is visible in search"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{user.name}</span>
                    {user.isVerified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Shield className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                  {user.mutualFriends > 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {user.mutualFriends} mutual{" "}
                      {user.mutualFriends === 1 ? "friend" : "friends"}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendRequest(user.id)}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No users found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendSearch;
