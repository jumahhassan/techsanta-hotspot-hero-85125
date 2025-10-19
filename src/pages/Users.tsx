import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users as UsersIcon, Plus, Trash2, UserX, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Users = () => {
  const [selectedRouterId, setSelectedRouterId] = useState<string>("");
  const { toast } = useToast();

  // Fetch routers
  const { data: routersData } = useQuery({
    queryKey: ["routers"],
    queryFn: () => routerAPI.getAll(),
  });

  const routers = routersData?.routers || [];

  // Fetch active users for selected router
  const { data: activeUsersData, isLoading: loadingActive, refetch: refetchActive } = useQuery({
    queryKey: ["activeUsers", selectedRouterId],
    queryFn: () => routerAPI.getActiveUsers(selectedRouterId),
    enabled: !!selectedRouterId,
    refetchInterval: false,
  });

  // Fetch all hotspot users for selected router
  const { data: allUsersData, isLoading: loadingAll, refetch: refetchAll } = useQuery({
    queryKey: ["hotspotUsers", selectedRouterId],
    queryFn: () => routerAPI.getHotspotUsers(selectedRouterId),
    enabled: !!selectedRouterId,
    refetchInterval: false,
  });

  const activeUsers = activeUsersData?.users || [];
  const allUsers = allUsersData?.users || [];

  const handleRefresh = () => {
    if (selectedRouterId) {
      refetchActive();
      refetchAll();
      toast({
        title: "Refreshing",
        description: "Updating user data...",
      });
    }
  };

  const handleDisconnectUser = async (userId: string) => {
    if (selectedRouterId) {
      try {
        await routerAPI.disconnectUser(selectedRouterId, userId);
        toast({
          title: "Success",
          description: "User disconnected",
        });
        refetchActive();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect user",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (selectedRouterId) {
      try {
        await routerAPI.deleteUser(selectedRouterId, userId);
        toast({
          title: "Success",
          description: "User deleted",
        });
        refetchAll();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const formatBytes = (bytes: string) => {
    const b = parseInt(bytes) || 0;
    if (b === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return Math.round((b / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-red-500 pl-4">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage hotspot users and active sessions</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedRouterId} onValueChange={setSelectedRouterId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select router" />
            </SelectTrigger>
            <SelectContent>
              {routers.map((router) => (
                <SelectItem key={router.id} value={router.id}>
                  {router.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={!selectedRouterId || loadingActive || loadingAll}
            className="border-red-200 hover:bg-red-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${(loadingActive || loadingAll) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {!selectedRouterId ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No router selected</h3>
              <p className="text-muted-foreground mb-4">
                {routers.length === 0
                  ? "Connect to a router first to manage users"
                  : "Select a router from the dropdown to view users"}
              </p>
              {routers.length === 0 && (
                <Link to="/routers">
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    Connect Router
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Users */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-red-500" />
                <CardTitle>Active Users ({activeUsers.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loadingActive ? (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  Loading active users...
                </div>
              ) : activeUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active users
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>MAC Address</TableHead>
                      <TableHead>Login By</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Upload</TableHead>
                      <TableHead>Download</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {user.user}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{user.address}</TableCell>
                        <TableCell className="font-mono text-sm">{user.mac}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.loginBy}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.uptime}</TableCell>
                        <TableCell className="text-sm">{formatBytes(user.bytesOut)}</TableCell>
                        <TableCell className="text-sm">{formatBytes(user.bytesIn)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnectUser(user.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Disconnect user"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* All Hotspot Users */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-red-500" />
                <CardTitle>All Hotspot Users ({allUsers.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loadingAll ? (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  Loading users...
                </div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Upload</TableHead>
                      <TableHead>Download</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="font-mono text-sm">{user.password}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.profile}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.disabled
                                ? "bg-gray-500 hover:bg-gray-600"
                                : "bg-green-500 hover:bg-green-600"
                            }
                          >
                            {user.disabled ? "Disabled" : "Enabled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatBytes(user.bytesOut || "0")}</TableCell>
                        <TableCell className="text-sm">{formatBytes(user.bytesIn || "0")}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Users;
