import { useQuery } from "@tanstack/react-query";
import { Activity, Ticket, TrendingUp, Wifi, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { routerAPI } from "@/lib/api/router";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Fetch connected routers
  const { data: routersData } = useQuery({
    queryKey: ["routers"],
    queryFn: () => routerAPI.getAll(),
    refetchInterval: 5000,
  });

  const routers = routersData?.routers || [];
  const totalActiveUsers = routers.reduce((sum, r) => sum + (r.activeUsers || 0), 0);
  const routerStatus = routers.length > 0 ? "Online" : "Offline";

  const stats = [
    {
      title: "Active Users",
      value: totalActiveUsers.toString(),
      icon: Activity,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Connected Routers",
      value: routers.length.toString(),
      icon: Ticket,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "System Status",
      value: routerStatus,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Network",
      value: routerStatus,
      icon: Wifi,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-red-500 pl-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">TechSanta Hotspot Manager</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden border-0 shadow-lg">
              <div className={`h-1.5 bg-gradient-to-r ${stat.gradient}`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connected Routers Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardTitle>Connected Routers</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {routers.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No routers connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect to a MikroTik router to start managing your hotspot
              </p>
              <Link to="/routers">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                  Connect Router
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Router Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>CPU Load</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routers.map((router) => (
                  <TableRow key={router.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {router.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{router.host}</TableCell>
                    <TableCell>{router.model}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          router.cpuLoad > 80
                            ? "border-red-500 text-red-500"
                            : router.cpuLoad > 50
                            ? "border-orange-500 text-orange-500"
                            : "border-green-500 text-green-500"
                        }
                      >
                        {router.cpuLoad}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        {router.activeUsers || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Online
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
