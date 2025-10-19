import { Building2, Phone, Wifi, Database, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-red-500 pl-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your TechSanta system preferences
        </p>
      </div>

      {/* Business Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-red-500" />
            <div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your company details and branding
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-red-500" />
            <div>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                General system preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Africa/Juba" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="SSP" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" defaultValue="English" />
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" className="border-red-200 hover:bg-red-50">
              Export Data
            </Button>
            <Button variant="outline" className="border-red-200 hover:bg-red-50">
              Backup System
            </Button>
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardTitle>About TechSanta</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Build:</strong> 2025.01</p>
            <p><strong>Support:</strong> +211924251197</p>
            <p className="text-muted-foreground pt-4">
              TechSanta Hotspot Manager - Modern hotspot management for MikroTik RouterOS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
