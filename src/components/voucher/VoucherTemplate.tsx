import { QRCodeSVG } from "qrcode.react";
import { Wifi, Calendar, Database, DollarSign } from "lucide-react";

export interface VoucherData {
  id: string;
  username: string;
  password: string;
  profile: string;
  dataLimit: string;
  expiryDate: string;
  price: string;
}

interface VoucherTemplateProps {
  data: VoucherData;
  template: "classic" | "minimal" | "modern" | "festive";
  showBranding?: boolean;
}

export const VoucherTemplate = ({ data, template, showBranding = true }: VoucherTemplateProps) => {
  const loginUrl = `http://192.168.4.1/login?username=${data.username}&password=${data.password}`;

  const templates = {
    classic: (
      <div className="w-[350px] h-[200px] bg-white border-2 border-red-500 rounded-lg p-4 print:break-inside-avoid relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Wifi className="w-32 h-32 text-red-500" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 border-b-2 border-red-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">TechSanta</h3>
                <p className="text-[10px] text-gray-600">Internet Voucher</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600">ID: {data.id}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex gap-3">
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-[9px] text-gray-600 uppercase font-semibold">Username</p>
                <p className="text-xs font-mono font-bold text-gray-900">{data.username}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-600 uppercase font-semibold">Password</p>
                <p className="text-xs font-mono font-bold text-gray-900">{data.password}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] text-gray-600 uppercase font-semibold flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> Plan
                  </p>
                  <p className="text-[10px] font-bold text-red-600">{data.profile}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-600 uppercase font-semibold flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" /> Data
                  </p>
                  <p className="text-[10px] font-bold text-gray-900">{data.dataLimit}</p>
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <QRCodeSVG value={loginUrl} size={70} level="M" />
              <p className="text-[8px] text-gray-600 mt-1">Scan to login</p>
            </div>
          </div>

          {/* Footer */}
          {showBranding && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <div className="flex items-center justify-between text-[9px] text-gray-600">
                <p className="flex items-center gap-1">
                  <DollarSign className="w-2.5 h-2.5" /> {data.price}
                </p>
                <p>Expires: {data.expiryDate}</p>
                <p>☎ +211924251197</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),

    minimal: (
      <div className="w-[350px] h-[200px] bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 print:break-inside-avoid">
        <div className="h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-red-500 rounded flex items-center justify-center">
                <Wifi className="w-3 h-3 text-red-500" />
              </div>
              <span className="text-sm font-bold text-gray-900">TechSanta</span>
            </div>
            <span className="text-[10px] text-gray-500">#{data.id}</span>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 items-center">
            <QRCodeSVG value={loginUrl} size={80} level="M" />
            
            <div className="flex-1 space-y-2">
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-[9px] text-gray-500">Username</p>
                <p className="text-sm font-mono font-bold text-gray-900">{data.username}</p>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-[9px] text-gray-500">Password</p>
                <p className="text-sm font-mono font-bold text-gray-900">{data.password}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <span>{data.profile}</span>
            <span>{data.dataLimit}</span>
            <span>{data.price}</span>
          </div>
        </div>
      </div>
    ),

    modern: (
      <div className="w-[350px] h-[200px] bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-[2px] print:break-inside-avoid">
        <div className="bg-white rounded-xl h-full p-4">
          <div className="h-full flex flex-col">
            {/* Header with gradient */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    TechSanta
                  </h3>
                  <p className="text-[10px] text-gray-600">Hotspot Access</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">{data.price}</p>
                <p className="text-[9px] text-gray-500">{data.profile}</p>
              </div>
            </div>

            {/* Credentials */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-2 mb-2">
                  <p className="text-[9px] text-gray-600 mb-1">Username</p>
                  <p className="text-xs font-mono font-bold text-gray-900">{data.username}</p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-2">
                  <p className="text-[9px] text-gray-600 mb-1">Password</p>
                  <p className="text-xs font-mono font-bold text-gray-900">{data.password}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="p-2 bg-white rounded-lg shadow-md">
                  <QRCodeSVG value={loginUrl} size={65} level="M" />
                </div>
              </div>
            </div>

            {/* Footer info */}
            {showBranding && (
              <div className="mt-auto pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-[9px] text-gray-600">
                  <span>{data.dataLimit} Data</span>
                  <span>Valid until {data.expiryDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    festive: (
      <div className="w-[350px] h-[200px] bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-4 print:break-inside-avoid relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
        
        <div className="relative z-10 h-full flex flex-col text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">🎅 TechSanta</h3>
                <p className="text-[10px] text-white/80">Season's Greetings!</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
              <p className="text-xs font-bold">{data.price}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-3 flex-1">
            <div className="flex-1 space-y-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <p className="text-[9px] text-white/80 mb-1">Username</p>
                <p className="text-xs font-mono font-bold">{data.username}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <p className="text-[9px] text-white/80 mb-1">Password</p>
                <p className="text-xs font-mono font-bold">{data.password}</p>
              </div>
              <div className="flex gap-2 text-[10px]">
                <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 flex-1">
                  <p className="text-white/80 text-[8px]">Plan</p>
                  <p className="font-bold">{data.profile}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 flex-1">
                  <p className="text-white/80 text-[8px]">Data</p>
                  <p className="font-bold">{data.dataLimit}</p>
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={loginUrl} size={65} level="M" />
              </div>
              <p className="text-[8px] text-white/80 mt-1">Scan to connect</p>
            </div>
          </div>

          {/* Footer */}
          {showBranding && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-center text-[9px] text-white/80">
                Connecting South Sudan — One Voucher at a Time • ☎ +211924251197
              </p>
            </div>
          )}
        </div>
      </div>
    ),
  };

  return templates[template];
};
