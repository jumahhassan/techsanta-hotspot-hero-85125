import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, RefreshCw, Wifi, Server } from "lucide-react";
import { BackendStatus } from "@/components/BackendStatus";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { routerAPI, Router } from "@/lib/api/router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Routers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    host: "",
    username: "admin",
    password: "",
    port: "8728",
  });

  // Fetch all connected routers - NO auto-refresh
  const { data: routersData, isLoading, refetch } = useQuery({
    queryKey: ["routers"],
    queryFn: () => routerAPI.getAll(),
    refetchInterval: false, // Disabled auto-refresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const routers = routersData?.routers || [];

  const connectMutation = useMutation({
    mutationFn: (params: typeof formData) =>
      routerAPI.connect({
        name: params.name,
        host: params.host,
        username: params.username,
        password: params.password,
        port: parseInt(params.port),
      }),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Connected",
          description: `Connected to ${data.router.name}`,
        });
        setIsDialogOpen(false);
        setFormData({
          name: "",
          host: "",
          username: "admin",
          password: "",
          port: "8728",
        });
        queryClient.invalidateQueries({ queryKey: ["routers"] });
      } else {
        toast({
          title: "Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (routerId: string) => routerAPI.disconnect(routerId),
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: "Router disconnected",
      });
      queryClient.invalidateQueries({ queryKey: ["routers"] });
    },
  });

  const handleConnect = async () => {
    if (!formData.host || !formData.username || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const testResult = await routerAPI.testConnection(
        formData.host,
        formData.username,
        formData.password,
        parseInt(formData.port)
      );

      if (testResult.success) {
        await connectMutation.mutateAsync(formData);
      } else {
        toast({
          title: "Connection Failed",
          description: testResult.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to router",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Updating router information...",
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Backend Status */}
      <BackendStatus />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-red-500 pl-4">
          <h1 className="text-3xl font-bold">Router Management</h1>
          <p className="text-muted-foreground">Connect and manage MikroTik routers</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-red-200 hover:bg-red-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Router
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-red-500" />
                  Connect to Router
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Router Name</Label>
                  <Input
                    id="name"
                    placeholder="My Router"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="host">IP Address</Label>
                  <Input
                    id="host"
                    placeholder="192.168.88.1"
                    value={formData.host}
                    onChange={(e) =>
                      setFormData({ ...formData, host: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="port">API Port</Label>
                  <Input
                    id="port"
                    value={formData.port}
                    onChange={(e) =>
                      setFormData({ ...formData, port: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Routers Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-red-500" />
            <CardTitle>Connected Routers ({routers.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              Loading routers...
            </div>
          ) : routers.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No routers connected</h3>
              <p className="text-muted-foreground mb-4">Connect to a MikroTik router to get started</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Router
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Router</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routers.map((router) => (
                  <TableRow key={router.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-medium">{router.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{router.host}</TableCell>
                    <TableCell className="text-sm">{router.model}</TableCell>
                    <TableCell className="text-sm">{router.version}</TableCell>
                    <TableCell className="text-sm">{router.uptime}</TableCell>
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
                    <TableCell className="text-sm">{formatBytes(router.freeMemory)}</TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        {router.activeUsers !== undefined ? router.activeUsers : "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefresh}
                          title="Refresh router data"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => disconnectMutation.mutate(router.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Disconnect router"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default Routers;
