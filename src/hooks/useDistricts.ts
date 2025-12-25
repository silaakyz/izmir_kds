import { useEffect, useState } from "react";
import { District } from "@/data/districtData";

const API_URL = import.meta.env.VITE_API_URL;

export const useDistricts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!API_URL) {
          throw new Error("VITE_API_URL tanımlı değil");
        }

        const res = await fetch(`${API_URL}/api/districts-full`);

        if (!res.ok) {
          throw new Error("District verileri alınamadı");
        }

        const data: District[] = await res.json();
        setDistricts(data);
      } catch (err: any) {
        console.error("[useDistricts] Backend error:", err);
        setError(err.message || "Veriler yüklenirken hata oluştu");
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  return { districts, loading, error };
};
