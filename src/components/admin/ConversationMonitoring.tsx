import React, { useState } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  Flag,
  BarChart2,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  status: "normal" | "flagged" | "suspicious";
}

interface ConversationData {
  id: string;
  participants: string[];
  lastActive: string;
  messageCount: number;
  flaggedCount: number;
}

const ConversationMonitoring = ({
  conversations = mockConversations,
  messages = mockMessages,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [timeRange, setTimeRange] = useState("24h");

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) =>
      p.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const filteredMessages = selectedConversation
    ? messages.filter((msg) => msg.id.startsWith(selectedConversation))
    : [];

  return (
    <div className="w-full h-full p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Conversation Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor and analyze user conversations for suspicious activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" />
            View Alerts
          </Button>
        </div>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="conversations">
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="flagged">
            <Flag className="mr-2 h-4 w-4" />
            Flagged Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversations.length}</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Flagged Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {messages.filter((m) => m.status === "flagged").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  -2% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Suspicious Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {messages.filter((m) => m.status === "suspicious").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Conversations</CardTitle>
              <CardDescription>
                Monitor ongoing conversations between users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participants</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Flagged</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <TableRow
                        key={conversation.id}
                        className={
                          selectedConversation === conversation.id
                            ? "bg-muted"
                            : ""
                        }
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {conversation.participants.join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>{conversation.lastActive}</TableCell>
                        <TableCell>{conversation.messageCount}</TableCell>
                        <TableCell>
                          {conversation.flaggedCount > 0 && (
                            <Badge variant="destructive">
                              {conversation.flaggedCount}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No conversations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedConversation && (
            <Card>
              <CardHeader>
                <CardTitle>Conversation Details</CardTitle>
                <CardDescription>
                  {conversations
                    .find((c) => c.id === selectedConversation)
                    ?.participants.join(" and ")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${message.sender === conversations.find((c) => c.id === selectedConversation)?.participants[0] ? "bg-muted ml-auto max-w-[80%]" : "bg-primary/10 mr-auto max-w-[80%]"}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          {message.sender}
                        </span>
                        <div className="flex items-center gap-1">
                          {message.status === "flagged" && (
                            <Badge variant="destructive">Flagged</Badge>
                          )}
                          {message.status === "suspicious" && (
                            <Badge variant="secondary">Suspicious</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedConversation(null)}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Flag Conversation
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Analytics</CardTitle>
              <CardDescription>
                View trends and patterns in user communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">
                  Analytics visualization would appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content</CardTitle>
              <CardDescription>
                Review messages that have been flagged for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages
                    .filter((m) => m.status !== "normal")
                    .map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>{message.sender}</TableCell>
                        <TableCell>{message.recipient}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {message.content}
                        </TableCell>
                        <TableCell>{message.timestamp}</TableCell>
                        <TableCell>
                          {message.status === "flagged" ? (
                            <Badge variant="destructive">Flagged</Badge>
                          ) : (
                            <Badge variant="secondary">Suspicious</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mock data
const mockConversations: ConversationData[] = [
  {
    id: "conv1",
    participants: ["John Doe", "Jane Smith"],
    lastActive: "2 mins ago",
    messageCount: 24,
    flaggedCount: 2,
  },
  {
    id: "conv2",
    participants: ["Alex Johnson", "Sam Wilson"],
    lastActive: "15 mins ago",
    messageCount: 56,
    flaggedCount: 0,
  },
  {
    id: "conv3",
    participants: ["Emily Davis", "Michael Brown"],
    lastActive: "1 hour ago",
    messageCount: 132,
    flaggedCount: 3,
  },
  {
    id: "conv4",
    participants: ["Sarah Miller", "David Clark"],
    lastActive: "3 hours ago",
    messageCount: 89,
    flaggedCount: 1,
  },
  {
    id: "conv5",
    participants: ["Jessica Lee", "Robert Taylor"],
    lastActive: "1 day ago",
    messageCount: 45,
    flaggedCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "conv1-msg1",
    sender: "John Doe",
    recipient: "Jane Smith",
    content: "Hey, how are you doing today?",
    timestamp: "2:30 PM",
    status: "normal",
  },
  {
    id: "conv1-msg2",
    sender: "Jane Smith",
    recipient: "John Doe",
    content: "I'm good! Just finishing up some work. How about you?",
    timestamp: "2:32 PM",
    status: "normal",
  },
  {
    id: "conv1-msg3",
    sender: "John Doe",
    recipient: "Jane Smith",
    content:
      "Let's meet at the usual place to discuss that sensitive information.",
    timestamp: "2:35 PM",
    status: "suspicious",
  },
  {
    id: "conv1-msg4",
    sender: "Jane Smith",
    recipient: "John Doe",
    content: "Sure, I'll bring the documents we talked about earlier.",
    timestamp: "2:40 PM",
    status: "flagged",
  },
  {
    id: "conv3-msg1",
    sender: "Emily Davis",
    recipient: "Michael Brown",
    content: "Did you get the package I sent?",
    timestamp: "11:20 AM",
    status: "suspicious",
  },
  {
    id: "conv3-msg2",
    sender: "Michael Brown",
    recipient: "Emily Davis",
    content: "Yes, I got it. Let's not discuss the contents over this channel.",
    timestamp: "11:25 AM",
    status: "flagged",
  },
  {
    id: "conv4-msg1",
    sender: "Sarah Miller",
    recipient: "David Clark",
    content: "The access codes you requested are 4829-3847-2958.",
    timestamp: "9:15 AM",
    status: "flagged",
  },
];

export default ConversationMonitoring;
