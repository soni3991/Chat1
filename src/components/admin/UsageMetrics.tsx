import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Users,
  MessageSquare,
  Clock,
} from "lucide-react";

interface UsageMetricsProps {
  timeRange?: string;
  activeUsers?: number;
  messagesSent?: number;
  averageResponseTime?: string;
  userGrowth?: number[];
  messageVolume?: number[];
  activeHours?: Record<string, number>;
  userRetention?: Record<string, number>;
}

const UsageMetrics: React.FC<UsageMetricsProps> = ({
  timeRange = "Last 7 days",
  activeUsers = 1245,
  messagesSent = 8732,
  averageResponseTime = "1m 32s",
  userGrowth = [120, 132, 145, 162, 178, 195, 210],
  messageVolume = [423, 512, 590, 605, 734, 821, 947],
  activeHours = {
    "00:00-04:00": 12,
    "04:00-08:00": 18,
    "08:00-12:00": 35,
    "12:00-16:00": 42,
    "16:00-20:00": 38,
    "20:00-24:00": 25,
  },
  userRetention = {
    "Day 1": 100,
    "Day 3": 82,
    "Day 7": 68,
    "Day 14": 54,
    "Day 30": 41,
  },
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Mock chart components - in a real implementation these would use a charting library
  const MockLineChart = ({
    data,
    className,
  }: {
    data: number[];
    className?: string;
  }) => (
    <div className={`bg-muted/20 rounded-md p-2 ${className}`}>
      <div className="flex items-end justify-between h-32 gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary w-full rounded-t-sm"
            style={{ height: `${(value / Math.max(...data)) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
    </div>
  );

  const MockPieChart = ({
    data,
    className,
  }: {
    data: Record<string, number>;
    className?: string;
  }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    let currentAngle = 0;

    return (
      <div className={`relative ${className}`}>
        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
          >
            {Object.entries(data).map(([label, value], index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              // Calculate SVG arc path
              const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
              const x2 =
                50 + 50 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 =
                50 + 50 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
              ].join(" ");

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={`hsl(${index * 40}, 70%, 60%)`}
                />
              );
            })}
          </svg>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(data).map(([label, value], index) => (
            <div key={index} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${index * 40}, 70%, 60%)` }}
              />
              <span>
                {label}: {Math.round((value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usage Metrics</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 24 hours">Last 24 hours</SelectItem>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="Last 90 days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {activeUsers.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {messagesSent.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{averageResponseTime}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                +
                {(
                  ((userGrowth[userGrowth.length - 1] - userGrowth[0]) /
                    userGrowth[0]) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Metrics
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Daily active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <MockLineChart data={userGrowth} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Volume</CardTitle>
                <CardDescription>Total messages sent per day</CardDescription>
              </CardHeader>
              <CardContent>
                <MockLineChart data={messageVolume} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User retention over time</CardDescription>
              </CardHeader>
              <CardContent>
                <MockPieChart data={userRetention} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>
                  New user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MockLineChart data={userGrowth} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Hours</CardTitle>
                <CardDescription>
                  Message activity by time of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MockPieChart data={activeHours} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Volume Trend</CardTitle>
                <CardDescription>Total messages over time</CardDescription>
              </CardHeader>
              <CardContent>
                <MockLineChart data={messageVolume} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsageMetrics;
