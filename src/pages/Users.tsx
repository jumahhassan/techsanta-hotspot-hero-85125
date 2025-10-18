import { useState } from "react";
import { Search, Plus, Edit, Trash2, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: 1,
      name: "John Doe",
      username: "john.doe",
      email: "john.doe@example.com",
      plan: "Premium",
      status: "online",
      dataUsed: "2.4 GB",
      dataLimit: "10 GB",
      mac: "00:1B:44:11:3A:B7",
    },
    {
      id: 2,
      name: "Sarah Smith",
      username: "sarah.smith",
      email: "sarah.smith@example.com",
      plan: "Basic",
      status: "offline",
      dataUsed: "5.2 GB",
      dataLimit: "5 GB",
      mac: "00:1B:44:11:3A:B8",
    },
    {
      id: 3,
      name: "Mike Wilson",
      username: "mike.wilson",
      email: "mike.wilson@example.com",
      plan: "Premium",
      status: "online",
      dataUsed: "1.8 GB",
      dataLimit: "10 GB",
      mac: "00:1B:44:11:3A:B9",
    },
    {
      id: 4,
      name: "Emma Brown",
      username: "emma.brown",
      email: "emma.brown@example.com",
      plan: "Standard",
      status: "online",
      dataUsed: "3.5 GB",
      dataLimit: "7 GB",
      mac: "00:1B:44:11:3A:C0",
    },
    {
      id: 5,
      name: "Alex Johnson",
      username: "alex.johnson",
      email: "alex.johnson@example.com",
      plan: "Basic",
      status: "offline",
      dataUsed: "1.2 GB",
      dataLimit: "5 GB",
      mac: "00:1B:44:11:3A:C1",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage and monitor all hotspot users</p>
        </div>
        <Button className="gradient-primary shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Usage</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CircleDot
                          className={`h-3 w-3 ${
                            user.status === "online"
                              ? "fill-green-500 text-green-500"
                              : "fill-gray-400 text-gray-400"
                          }`}
                        />
                        <span className="capitalize">{user.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">
                          {user.dataUsed} / {user.dataLimit}
                        </p>
                        <div className="h-2 w-24 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${
                                (parseFloat(user.dataUsed) /
                                  parseFloat(user.dataLimit)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{user.mac}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
