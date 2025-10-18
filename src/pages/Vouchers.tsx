import { useState } from "react";
import { Plus, Download, QrCode, Printer, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const Vouchers = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const vouchers = [
    {
      id: 1,
      code: "TECH-5H-001",
      plan: "5 Hours",
      price: "$5.00",
      status: "active",
      createdAt: "2024-01-15",
      expiresAt: "2024-02-15",
      used: false,
    },
    {
      id: 2,
      code: "TECH-1D-002",
      plan: "1 Day",
      price: "$10.00",
      status: "used",
      createdAt: "2024-01-14",
      expiresAt: "2024-02-14",
      used: true,
      usedAt: "2024-01-20",
    },
    {
      id: 3,
      code: "TECH-1W-003",
      plan: "1 Week",
      price: "$25.00",
      status: "active",
      createdAt: "2024-01-13",
      expiresAt: "2024-02-13",
      used: false,
    },
    {
      id: 4,
      code: "TECH-1M-004",
      plan: "1 Month",
      price: "$50.00",
      status: "expired",
      createdAt: "2023-12-01",
      expiresAt: "2024-01-01",
      used: false,
    },
    {
      id: 5,
      code: "TECH-5H-005",
      plan: "5 Hours",
      price: "$5.00",
      status: "active",
      createdAt: "2024-01-16",
      expiresAt: "2024-02-16",
      used: false,
    },
  ];

  const filteredVouchers =
    filterStatus === "all"
      ? vouchers
      : vouchers.filter((v) => v.status === filterStatus);

  const stats = {
    total: vouchers.length,
    active: vouchers.filter((v) => v.status === "active").length,
    used: vouchers.filter((v) => v.status === "used").length,
    expired: vouchers.filter((v) => v.status === "expired").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voucher Management</h1>
          <p className="text-muted-foreground">Generate and manage hotspot vouchers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="gradient-primary shadow-glow">
            <Plus className="mr-2 h-4 w-4" />
            Generate Vouchers
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Vouchers</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Used</p>
              <p className="text-3xl font-bold text-blue-600">{stats.used}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Expired</p>
              <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Vouchers</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "used" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("used")}
              >
                Used
              </Button>
              <Button
                variant={filterStatus === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("expired")}
              >
                Expired
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher Code</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-mono font-medium">
                      {voucher.code}
                    </TableCell>
                    <TableCell>{voucher.plan}</TableCell>
                    <TableCell className="font-semibold">{voucher.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          voucher.status === "active"
                            ? "default"
                            : voucher.status === "used"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          voucher.status === "active"
                            ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                            : ""
                        }
                      >
                        {voucher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{voucher.createdAt}</TableCell>
                    <TableCell className="text-sm">{voucher.expiresAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Generate QR Code">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Print Voucher">
                          <Printer className="h-4 w-4" />
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

export default Vouchers;
