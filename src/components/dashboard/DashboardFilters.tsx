import { Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface DashboardFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  scoreRange: number[];
  setScoreRange: (value: number[]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  stats: {
    highPerformers: number;
    mediumPerformers: number;
    lowPerformers: number;
  };
}

export const DashboardFilters = ({
  selectedCategory,
  setSelectedCategory,
  scoreRange,
  setScoreRange,
  sortBy,
  setSortBy,
  stats,
}: DashboardFiltersProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "infrastructure", label: "Altyapı" },
    { value: "environment", label: "Çevre" },
    { value: "social", label: "Sosyal" },
    { value: "transportation", label: "Ulaşım" },
    { value: "security", label: "Güvenlik" },
    { value: "education", label: "Eğitim" },
    { value: "health", label: "Sağlık" },
  ];

  const sortOptions = [
    { value: "score-desc", label: "Skor (Yüksek → Düşük)" },
    { value: "score-asc", label: "Skor (Düşük → Yüksek)" },
    { value: "name-asc", label: "İsim (A → Z)" },
    { value: "name-desc", label: "İsim (Z → A)" },
  ];

  const distributionData = [
    { name: "Yüksek", value: stats.highPerformers, color: "#10b981" },
    { name: "Orta", value: stats.mediumPerformers, color: "#f59e0b" },
    { name: "Düşük", value: stats.lowPerformers, color: "#ef4444" },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 sticky top-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Filtreler
            </CardTitle>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Kategori
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border shadow-lg z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Score Range Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Skor Aralığı
                </label>
                <Badge variant="secondary" className="text-xs">
                  {scoreRange[0]} - {scoreRange[1]}
                </Badge>
              </div>
              <Slider
                value={scoreRange}
                onValueChange={setScoreRange}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Sıralama
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border shadow-lg z-50">
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Distribution Mini Chart */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <label className="text-xs font-medium text-muted-foreground">
                Performans Dağılımı
              </label>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
