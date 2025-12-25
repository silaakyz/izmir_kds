import { useState } from "react";
import IzmirMap from "./IzmirMap";
import { District } from "@/lib/district";
import { MapPin } from "lucide-react";
import { RadarAnalysis } from "@/components/dashboard/RadarAnalysis";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";

interface InteractiveMapProps {
  districts: District[];
}

export const InteractiveMap = ({ districts }: InteractiveMapProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  return (
    <div className="space-y-6">
      {/* HARİTA */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">İzmir Bölge Haritası</h3>
            <p className="text-sm text-muted-foreground">
              İlçeye tıkla → önerilen aksiyonlar gelsin
            </p>
          </div>
        </div>

        <IzmirMap
          districts={districts}
          onSelectDistrict={setSelectedDistrict}
        />
      </div>

      {/* ALT ANALİZLER */}
      {selectedDistrict && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* SOL: KRİTER ANALİZİ */}
          <RadarAnalysis district={selectedDistrict} />

          {/* SAĞ: ÖNERİLEN AKSİYONLAR */}
          <RecommendationsPanel
            districts={[selectedDistrict]}
          />
        </div>
      )}
    </div>
  );
};
