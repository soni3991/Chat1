import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  AlertTriangle,
  Settings,
  Shield,
  Bell,
  MessageSquare,
  Users,
  Save,
  RefreshCw,
} from "lucide-react";

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "security" | "messaging" | "users" | "notifications";
}

interface FeatureManagementProps {
  features?: FeatureToggle[];
  onToggleFeature?: (featureId: string, enabled: boolean) => void;
  onSaveSettings?: () => void;
}

const FeatureManagement = ({
  features = [
    {
      id: "end-to-end-encryption",
      name: "End-to-End Encryption",
      description: "Enable secure message encryption between users",
      enabled: true,
      category: "security",
    },
    {
      id: "two-factor-auth",
      name: "Two-Factor Authentication",
      description: "Require additional verification during login",
      enabled: true,
      category: "security",
    },
    {
      id: "media-sharing",
      name: "Media Sharing",
      description: "Allow users to share images and videos",
      enabled: true,
      category: "messaging",
    },
    {
      id: "group-chats",
      name: "Group Conversations",
      description: "Enable users to create and participate in group chats",
      enabled: true,
      category: "messaging",
    },
    {
      id: "friend-discovery",
      name: "Friend Discovery",
      description: "Allow users to find friends through the platform",
      enabled: true,
      category: "users",
    },
    {
      id: "push-notifications",
      name: "Push Notifications",
      description: "Send notifications for new messages and activities",
      enabled: true,
      category: "notifications",
    },
    {
      id: "read-receipts",
      name: "Read Receipts",
      description: "Show when messages have been read by recipients",
      enabled: false,
      category: "messaging",
    },
    {
      id: "typing-indicators",
      name: "Typing Indicators",
      description: "Show when users are typing in a conversation",
      enabled: true,
      category: "messaging",
    },
  ],
  onToggleFeature = () => {},
  onSaveSettings = () => {},
}: FeatureManagementProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Filter features based on active tab and search query
  const filteredFeatures = features.filter((feature) => {
    const matchesTab = activeTab === "all" || feature.category === activeTab;
    const matchesSearch =
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleToggleFeature = (featureId: string, enabled: boolean) => {
    onToggleFeature(featureId, enabled);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return <Shield className="h-5 w-5" />;
      case "messaging":
        return <MessageSquare className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "notifications":
        return <Bell className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Feature Management</h1>
          <p className="text-muted-foreground">
            Control platform features and settings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
              id="maintenance-mode"
            />
            <label
              htmlFor="maintenance-mode"
              className="text-sm font-medium cursor-pointer"
            >
              Maintenance Mode
            </label>
          </div>
          <Button onClick={onSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {maintenanceMode && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-900">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium">Maintenance Mode Active</p>
              <p className="text-sm">
                The platform is currently in maintenance mode. All features are
                disabled for regular users.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-6">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-4">
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
          <Select defaultValue="active">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(feature.category)}
                  <CardTitle>{feature.name}</CardTitle>
                </div>
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={(checked) =>
                    handleToggleFeature(feature.id, checked)
                  }
                />
              </div>
              <CardDescription className="mt-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-muted/50 py-3 flex justify-between">
              <span className="text-xs text-muted-foreground capitalize">
                {feature.category}
              </span>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No features found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeatureManagement;
