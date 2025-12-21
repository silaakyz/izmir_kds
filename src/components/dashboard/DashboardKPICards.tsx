import {
  Target,
  TrendingUp,
  TrendingDown,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardKPICardsProps {
  stats: {
    avgScore: number;
    highPerformers: number;
    mediumPerformers: number;
    lowPerformers: number;
    totalActions: number;
    maxScore: number;
    minScore: number;
    totalDistricts: number;
  };
}

export const DashboardKPICards = ({ stats }: DashboardKPICardsProps) => {
  const kpiCards = [
    {
      title: "Ortalama Skor",
      value: stats.avgScore.toFixed(1),
      subtitle: "10 üzerinden",
      icon: Target,
      trend: { value: 3.2, isPositive: true },
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      title: "Toplam Bölge",
      value: stats.totalDistricts,
      subtitle: "aktif izleme",
      icon: MapPin,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
    {
      title: "Yüksek Performans",
      value: stats.highPerformers,
      subtitle: "8+ skor",
      icon: CheckCircle2,
      trend: { value: 12, isPositive: true },
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
    },
    {
      title: "Orta Performans",
      value: stats.mediumPerformers,
      subtitle: "5-8 skor",
      icon: Activity,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
    {
      title: "Düşük Performans",
      value: stats.lowPerformers,
      subtitle: "5 altı skor",
      icon: AlertTriangle,
      trend: { value: 5, isPositive: false },
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      textColor: "text-red-500",
    },
    {
      title: "En Yüksek Skor",
      value: stats.maxScore.toFixed(1),
      subtitle: "en iyi bölge",
      icon: TrendingUp,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-500",
    },
    {
      title: "En Düşük Skor",
      value: stats.minScore.toFixed(1),
      subtitle: "öncelikli bölge",
      icon: TrendingDown,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
    },
    {
      title: "Aksiyon Önerisi",
      value: stats.totalActions,
      subtitle: "öncelikli eylem",
      icon: Zap,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpiCards.map((kpi, index) => (
        <Card
          key={kpi.title}
          className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.textColor}`} />
              </div>
              {kpi.trend && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    kpi.trend.isPositive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {kpi.trend.isPositive ? "↑" : "↓"} {kpi.trend.value}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {kpi.title}
            </p>
            <p className="text-[10px] text-muted-foreground/70">{kpi.subtitle}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
