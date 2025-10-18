import { Building2, Phone, Wifi, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your TechSanta system preferences
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Business Information</CardTitle>
          </div>
          <CardDescription>
            Update your company details and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="TechSanta" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+211924251197" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="info@techsanta.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input id="address" placeholder="Enter your business address" />
          </div>
          <Button className="gradient-primary">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Router Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            <CardTitle>Router Configuration</CardTitle>
          </div>
          <CardDescription>
            Connect to your MikroTik RouterOS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="routerIp">Router IP Address</Label>
              <Input id="routerIp" placeholder="192.168.88.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routerPort">Router Port</Label>
              <Input id="routerPort" placeholder="8728" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="routerUser">Username</Label>
              <Input id="routerUser" placeholder="admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routerPass">Password</Label>
              <Input id="routerPass" type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Test Connection</Button>
            <Button className="gradient-primary">Save & Connect</Button>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>System Settings</CardTitle>
          </div>
          <CardDescription>
            General system preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" defaultValue="Africa/Juba" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" defaultValue="USD" />
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline">Export Data</Button>
            <Button variant="outline">Backup System</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
