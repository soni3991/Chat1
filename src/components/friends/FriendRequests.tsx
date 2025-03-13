import React from "react";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FriendRequestProps {
  requests?: {
    incoming: FriendRequest[];
    outgoing: FriendRequest[];
  };
}

interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    lastSeen?: string;
  };
  timestamp: string;
}

const FriendRequests: React.FC<FriendRequestProps> = ({
  requests = {
    incoming: [
      {
        id: "1",
        user: {
          id: "user1",
          name: "Alex Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          lastSeen: "2 hours ago",
        },
        timestamp: "2023-06-15T14:30:00Z",
      },
      {
        id: "2",
        user: {
          id: "user2",
          name: "Jamie Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
          lastSeen: "Just now",
        },
        timestamp: "2023-06-16T09:45:00Z",
      },
      {
        id: "3",
        user: {
          id: "user3",
          name: "Taylor Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
          lastSeen: "3 days ago",
        },
        timestamp: "2023-06-14T11:20:00Z",
      },
    ],
    outgoing: [
      {
        id: "4",
        user: {
          id: "user4",
          name: "Morgan Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
          lastSeen: "1 day ago",
        },
        timestamp: "2023-06-15T16:10:00Z",
      },
      {
        id: "5",
        user: {
          id: "user5",
          name: "Casey Brown",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
          lastSeen: "5 hours ago",
        },
        timestamp: "2023-06-16T08:30:00Z",
      },
    ],
  },
}) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full bg-background p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Incoming Friend Requests</h2>
        {requests.incoming.length === 0 ? (
          <p className="text-muted-foreground">No incoming friend requests</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.incoming.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={request.user.avatar}
                        alt={request.user.name}
                      />
                      <AvatarFallback>
                        {request.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {request.user.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Last seen: {request.user.lastSeen || "Unknown"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Requested on {formatDate(request.timestamp)}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-[48%] flex items-center gap-1"
                    onClick={() =>
                      console.log(`Accept request from ${request.user.name}`)
                    }
                  >
                    <Check className="h-4 w-4" /> Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[48%] flex items-center gap-1"
                    onClick={() =>
                      console.log(`Decline request from ${request.user.name}`)
                    }
                  >
                    <X className="h-4 w-4" /> Decline
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Outgoing Friend Requests</h2>
        {requests.outgoing.length === 0 ? (
          <p className="text-muted-foreground">No outgoing friend requests</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.outgoing.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={request.user.avatar}
                        alt={request.user.name}
                      />
                      <AvatarFallback>
                        {request.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {request.user.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Last seen: {request.user.lastSeen || "Unknown"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Sent on {formatDate(request.timestamp)}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={() =>
                      console.log(`Cancel request to ${request.user.name}`)
                    }
                  >
                    <Clock className="h-4 w-4" /> Pending
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
