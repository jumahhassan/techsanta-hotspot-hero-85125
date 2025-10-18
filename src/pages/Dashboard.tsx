import { Users, Ticket, TrendingUp, Wifi, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,284",
      icon: Users,
      trend: "+12% from last month",
      trendUp: true,
    },
    {
      title: "Active Users",
      value: "847",
      icon: Activity,
      trend: "Currently online",
      trendUp: true,
    },
    {
      title: "Vouchers Sold",
      value: "3,456",
      icon: Ticket,
      trend: "+18% from last month",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: TrendingUp,
      trend: "+23% from last month",
      trendUp: true,
    },
  ];

  const usageData = [
    { name: "Mon", users: 65, bandwidth: 45 },
    { name: "Tue", users: 75, bandwidth: 52 },
    { name: "Wed", users: 85, bandwidth: 61 },
    { name: "Thu", users: 95, bandwidth: 70 },
    { name: "Fri", users: 110, bandwidth: 85 },
    { name: "Sat", users: 125, bandwidth: 95 },
    { name: "Sun", users: 105, bandwidth: 80 },
  ];

  const recentActivity = [
    { user: "john.doe@example.com", action: "Login", status: "online", time: "2 mins ago" },
    { user: "sarah.smith@example.com", action: "Logout", status: "offline", time: "5 mins ago" },
    { user: "mike.wilson@example.com", action: "Login", status: "online", time: "12 mins ago" },
    { user: "emma.brown@example.com", action: "Voucher Used", status: "online", time: "15 mins ago" },
    { user: "alex.johnson@example.com", action: "Login", status: "online", time: "20 mins ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl p-8 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-3 mb-2">
          <Wifi className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Welcome to TechSanta</h1>
        </div>
        <p className="text-lg opacity-90">
          Modern hotspot management system - Monitor your network in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Bandwidth Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bandwidth"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={activity.status === "online" ? "default" : "secondary"}
                    className={
                      activity.status === "online"
                        ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                        : ""
                    }
                  >
                    {activity.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
