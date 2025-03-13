import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertTriangle,
  CheckCircle,
  Flag,
  MessageSquare,
  Search,
  Shield,
  X,
} from "lucide-react";

interface FlaggedMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  severity: "low" | "medium" | "high";
}

const FlaggedContent = ({
  messages = mockFlaggedMessages,
}: {
  messages?: FlaggedMessage[];
}) => {
  const [selectedMessage, setSelectedMessage] = useState<FlaggedMessage | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredMessages =
    filterStatus === "all"
      ? messages
      : messages.filter((msg) => msg.status === filterStatus);

  const pendingCount = messages.filter(
    (msg) => msg.status === "pending",
  ).length;
  const reviewedCount = messages.filter(
    (msg) => msg.status === "reviewed",
  ).length;
  const dismissedCount = messages.filter(
    (msg) => msg.status === "dismissed",
  ).length;

  const handleReviewMessage = (message: FlaggedMessage) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="destructive" className="ml-2">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="ml-2">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="ml-2">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Flagged Content</h1>
          <p className="text-muted-foreground">
            Review and manage flagged messages and content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search flagged content..."
              className="pl-9 h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Reviewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reviewedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <X className="h-5 w-5 mr-2 text-gray-500" />
              Dismissed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dismissedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="profiles">User Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content</CardTitle>
              <CardDescription>
                Review and take action on flagged content across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Flag className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No flagged content matching your filters</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                          <span className="font-medium">{message.sender}</span>
                          {getSeverityBadge(message.severity)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm mb-3 line-clamp-2">
                        {message.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <Badge variant="outline" className="mr-2">
                            <Flag className="h-3 w-3 mr-1" />
                            {message.reason}
                          </Badge>
                          <Badge
                            variant={
                              message.status === "pending"
                                ? "default"
                                : message.status === "reviewed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {message.status}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleReviewMessage(message)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredMessages.length} of {messages.length} items
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Messages</CardTitle>
              <CardDescription>
                Review messages that have been flagged by users or the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Select the Messages tab to view flagged messages</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Media</CardTitle>
              <CardDescription>
                Review images, videos, and other media that have been flagged
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Select the Media tab to view flagged media content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>Flagged User Profiles</CardTitle>
              <CardDescription>
                Review user profiles that have been reported for inappropriate
                content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>
                  Select the User Profiles tab to view flagged user accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Flagged Content</DialogTitle>
            <DialogDescription>
              Review the flagged content and take appropriate action.
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {selectedMessage.sender}
                    </span>
                    {getSeverityBadge(selectedMessage.severity)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedMessage.timestamp}
                  </span>
                </div>
                <p className="text-sm mb-3">{selectedMessage.content}</p>
                <div>
                  <Badge variant="outline" className="mr-2">
                    <Flag className="h-3 w-3 mr-1" />
                    {selectedMessage.reason}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Action Notes</h4>
                <textarea
                  className="w-full h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Add notes about this review..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center">
            <Select defaultValue="warning">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warning">Issue Warning</SelectItem>
                <SelectItem value="restrict">Restrict Account</SelectItem>
                <SelectItem value="suspend">Suspend Account</SelectItem>
                <SelectItem value="ban">Ban Account</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Dismiss
              </Button>
              <Button onClick={() => setDialogOpen(false)}>
                Mark as Reviewed
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Mock data for flagged messages
const mockFlaggedMessages: FlaggedMessage[] = [
  {
    id: "1",
    content:
      "Hey, check out this link to get free access to premium content without paying! [suspicious-link.com]",
    sender: "user123",
    timestamp: "Today at 10:23 AM",
    reason: "Suspicious link",
    status: "pending",
    severity: "high",
  },
  {
    id: "2",
    content: "I don't appreciate your tone. This conversation is over.",
    sender: "jane_doe",
    timestamp: "Yesterday at 3:45 PM",
    reason: "Reported by user",
    status: "reviewed",
    severity: "low",
  },
  {
    id: "3",
    content:
      "This message contains language that violates our community guidelines and has been automatically flagged for review.",
    sender: "anonymous_user",
    timestamp: "Jul 15, 2023",
    reason: "Inappropriate language",
    status: "pending",
    severity: "medium",
  },
  {
    id: "4",
    content:
      "I've been trying to reach you about your car's extended warranty. Please call me back at this number immediately.",
    sender: "marketing_account",
    timestamp: "Jul 14, 2023",
    reason: "Spam",
    status: "dismissed",
    severity: "low",
  },
  {
    id: "5",
    content:
      "Your account will be suspended unless you verify your identity by sending your password to this email address.",
    sender: "security_team_official",
    timestamp: "Jul 12, 2023",
    reason: "Phishing attempt",
    status: "pending",
    severity: "high",
  },
];

export default FlaggedContent;
