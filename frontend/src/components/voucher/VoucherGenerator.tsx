import { useState } from "react";
import { Download, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VoucherTemplate, VoucherData } from "./VoucherTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

const VoucherGenerator = () => {
  const { toast } = useToast();
  const [template, setTemplate] = useState<"classic" | "minimal" | "modern" | "festive">("classic");
  const [vouchersPerPage, setVouchersPerPage] = useState<number>(20);
  const [showBranding, setShowBranding] = useState(true);
  const [customWatermark, setCustomWatermark] = useState("Valid at TechSanta Hotspot – Terekeka");

  const sampleVouchers: VoucherData[] = [
    {
      id: "TS-001",
      username: "tech5h001",
      password: "pass1234",
      profile: "5 Hours",
      dataLimit: "2 GB",
      expiryDate: "2025-02-01",
      price: "SSP 5.00",
    },
    {
      id: "TS-002",
      username: "tech1d002",
      password: "wifi5678",
      profile: "1 Day",
      dataLimit: "5 GB",
      expiryDate: "2025-02-01",
      price: "SSP 10.00",
    },
    {
      id: "TS-003",
      username: "tech1w003",
      password: "net9012",
      profile: "1 Week",
      dataLimit: "20 GB",
      expiryDate: "2025-02-15",
      price: "SSP 25.00",
    },
    {
      id: "TS-004",
      username: "tech1m004",
      password: "wifi3456",
      profile: "1 Month",
      dataLimit: "50 GB",
      expiryDate: "2025-03-01",
      price: "SSP 50.00",
    },
  ];

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Vouchers displayed below. Adjust settings and export when ready.",
    });
  };

  const handleExportPDF = async () => {
    toast({
      title: "Generating PDF",
      description: "Please wait while we create your voucher PDF...",
    });

    try {
      const element = document.getElementById("voucher-grid");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`TechSanta-Vouchers-${new Date().getTime()}.pdf`);

      toast({
        title: "Success",
        description: "PDF exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPNG = async () => {
    toast({
      title: "Generating Images",
      description: "Exporting vouchers as PNG images...",
    });

    try {
      const element = document.getElementById("voucher-grid");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `TechSanta-Vouchers-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Success",
        description: "Image exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardTitle>Voucher Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template Style</Label>
              <Select value={template} onValueChange={(value: any) => setTemplate(value)}>
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="festive">Festive (Santa)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perPage">Vouchers Per Page</Label>
              <Select
                value={vouchersPerPage.toString()}
                onValueChange={(value) => setVouchersPerPage(parseInt(value))}
              >
                <SelectTrigger id="perPage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="30">30 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="watermark">Custom Text</Label>
              <Input
                id="watermark"
                value={customWatermark}
                onChange={(e) => setCustomWatermark(e.target.value)}
                placeholder="e.g., Valid at TechSanta - Juba"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-red-200 hover:bg-red-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="border-blue-200 hover:bg-blue-50"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPNG}
              className="border-green-200 hover:bg-green-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PNG
            </Button>
            <Button
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg"
              onClick={handleExportPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle>Voucher Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              {sampleVouchers.length} vouchers ready
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            id="voucher-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 print:grid-cols-2"
          >
            {sampleVouchers.map((voucher) => (
              <VoucherTemplate
                key={voucher.id}
                data={voucher}
                template={template}
                showBranding={showBranding}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #voucher-grid,
          #voucher-grid * {
            visibility: visible;
          }
          #voucher-grid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default VoucherGenerator;
