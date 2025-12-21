import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/data/districtData';

export const useDistricts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError(null);

        // En son skorları almak için Q1 2025 verilerini çek
        const currentPeriodStart = '2025-01-01';
        const currentPeriodEnd = '2025-03-31';

        // Tüm bölgeleri çek
        const { data: districtsData, error: districtsError } = await supabase
          .from('districts')
          .select('*')
          .order('id');

        if (districtsError) throw districtsError;
        if (!districtsData) return;

        // Her bölge için skorları, negatif faktörleri, trend verilerini ve aksiyonları çek
        const districtsWithData = await Promise.all(
          districtsData.map(async (district) => {
            // Skorları çek
            const { data: scoresData } = await supabase
              .from('district_scores')
              .select('*')
              .eq('district_id', district.id)
              .eq('period_start', currentPeriodStart)
              .eq('period_end', currentPeriodEnd)
              .single();

            // Negatif faktörleri çek
            const { data: factorsData } = await supabase
              .from('negative_factors')
              .select('*')
              .eq('district_id', district.id)
              .eq('period_start', currentPeriodStart)
              .eq('period_end', currentPeriodEnd)
              .single();

            // Trend verilerini çek (çeyreklik)
            const { data: trendData } = await supabase
              .from('trend_data')
              .select('overall_score')
              .eq('district_id', district.id)
              .eq('period_type', 'quarterly')
              .order('period_value')
              .limit(4);

            // Önerilen aksiyonları çek
            const { data: actionsData } = await supabase
              .from('recommended_actions')
              .select('*')
              .eq('district_id', district.id)
              .order('priority', { ascending: false });

            // Veriyi District formatına dönüştür
            const districtFormatted: District = {
              id: district.id,
              name: district.name,
              coordinates: [district.latitude, district.longitude],
              radius: district.radius,
              scores: scoresData
                ? {
                    infrastructure: Number(scoresData.infrastructure),
                    environment: Number(scoresData.environment),
                    social: Number(scoresData.social),
                    transportation: Number(scoresData.transportation),
                    security: Number(scoresData.security),
                    education: Number(scoresData.education),
                    health: Number(scoresData.health),
                    overall: Number(scoresData.overall),
                  }
                : {
                    infrastructure: 0,
                    environment: 0,
                    social: 0,
                    transportation: 0,
                    security: 0,
                    education: 0,
                    health: 0,
                    overall: 0,
                  },
              negativeFactors: factorsData
                ? {
                    uncontrolledMigration: Number(factorsData.uncontrolled_migration),
                    informalSettlement: Number(factorsData.informal_settlement),
                    crimeRate: Number(factorsData.crime_rate),
                    trafficCongestion: Number(factorsData.traffic_congestion),
                    noisePollution: Number(factorsData.noise_pollution),
                  }
                : {
                    uncontrolledMigration: 0,
                    informalSettlement: 0,
                    crimeRate: 0,
                    trafficCongestion: 0,
                    noisePollution: 0,
                  },
              trendData: trendData
                ? trendData.map((t) => Number(t.overall_score))
                : [0, 0, 0, 0],
              recommendedActions: actionsData
                ? actionsData.map((action) => ({
                    action: action.action,
                    potentialScore: Number(action.potential_score),
                    priority: action.priority,
                    budget: action.budget || '',
                  }))
                : [],
            };

            return districtFormatted;
          })
        );

        setDistricts(districtsWithData);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError(err instanceof Error ? err.message : 'Veriler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  return { districts, loading, error };
};
