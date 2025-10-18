import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <Card className="p-6 transition-all hover:shadow-lg hover:scale-105 animate-slide-up border-l-4 border-l-primary">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{value}</p>
          {trend && (
            <p className="text-xs font-medium text-primary flex items-center gap-1">
              {trend}
            </p>
          )}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
