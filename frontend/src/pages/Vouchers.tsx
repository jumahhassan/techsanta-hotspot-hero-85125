import { useState } from "react";
import { Plus, Download, Ticket, FileText } from "lucide-react";
import VoucherGenerator from "@/components/voucher/VoucherGenerator";
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

const Vouchers = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showGenerator, setShowGenerator] = useState(false);

  const vouchers = [
    {
      id: 1,
      code: "TECH-5H-001",
      plan: "5 Hours",
      price: "SSP 5.00",
      status: "active",
      createdAt: "2024-01-15",
      expiresAt: "2024-02-15",
    },
    {
      id: 2,
      code: "TECH-1D-002",
      plan: "1 Day",
      price: "SSP 10.00",
      status: "used",
      createdAt: "2024-01-14",
      expiresAt: "2024-02-14",
    },
    {
      id: 3,
      code: "TECH-1W-003",
      plan: "1 Week",
      price: "SSP 25.00",
      status: "active",
      createdAt: "2024-01-13",
      expiresAt: "2024-02-13",
    },
    {
      id: 4,
      code: "TECH-1M-004",
      plan: "1 Month",
      price: "SSP 50.00",
      status: "expired",
      createdAt: "2023-12-01",
      expiresAt: "2024-01-01",
    },
    {
      id: 5,
      code: "TECH-5H-005",
      plan: "5 Hours",
      price: "SSP 5.00",
      status: "active",
      createdAt: "2024-01-16",
      expiresAt: "2024-02-16",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-red-500 pl-4">
          <h1 className="text-3xl font-bold">Voucher Management</h1>
          <p className="text-muted-foreground">Generate and manage vouchers</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-blue-200 hover:bg-blue-50"
            onClick={() => setShowGenerator(!showGenerator)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {showGenerator ? "View List" : "Template Generator"}
          </Button>
          <Button variant="outline" className="border-red-200 hover:bg-red-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>

      {/* Template Generator */}
      {showGenerator && <VoucherGenerator />}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-slate-500 to-slate-600" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vouchers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.used}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Vouchers Table */}
      {!showGenerator && (
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-red-500" />
              <CardTitle>All Vouchers</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" ? "bg-gradient-to-r from-red-500 to-orange-500" : ""}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
                className={filterStatus === "active" ? "bg-green-600" : ""}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "used" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("used")}
                className={filterStatus === "used" ? "bg-blue-600" : ""}
              >
                Used
              </Button>
              <Button
                variant={filterStatus === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("expired")}
                className={filterStatus === "expired" ? "bg-red-600" : ""}
              >
                Expired
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher Code</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
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
                      className={
                        voucher.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : voucher.status === "used"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {voucher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{voucher.createdAt}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{voucher.expiresAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default Vouchers;
