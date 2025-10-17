import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: "primary" | "success" | "warning" | "destructive";
}

export function StatsCard({ title, value, icon: Icon, trend, iconColor = "primary" }: StatsCardProps) {
  const iconColorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
            {trend && (
              <p className={`text-xs mt-2 ${trend.isPositive ? "text-success" : "text-destructive"}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconColorClasses[iconColor]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
