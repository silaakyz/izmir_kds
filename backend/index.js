import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
const API_PORT = 4000;

app.use(cors());
app.use(express.json());

/* ===============================
   TEST
================================ */
app.get("/api/hello", (req, res) => {
  res.json({ mesaj: "Server çalışıyor" });
});

/* ===============================
   LOGIN (DÜZ ŞİFRE)
================================ */
app.post("/api/login", async (req, res) => {
  try {
    const { tc, password } = req.body;

    if (!tc || !password) {
      return res.status(400).json({
        success: false,
        message: "TC ve şifre gerekli",
      });
    }

    const [rows] = await db.query(
      "SELECT id, tc, password_hash, role FROM users WHERE tc = ?",
      [tc]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // 🔥 DÜZ ŞİFRE KARŞILAŞTIRMA
    if (password !== user.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Şifre yanlış",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        tc: user.tc,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN HATASI:", err);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

/* ===============================
   🔥 FULL DISTRICT DATA (AYNI)
================================ */
app.get("/api/districts-full", async (req, res) => {
  try {
    const [districts] = await db.query("SELECT * FROM districts");
    const result = [];

    for (const d of districts) {
      const [[scores]] = await db.query(
        `SELECT * FROM district_scores WHERE district_id = ? ORDER BY year DESC, score_date DESC LIMIT 1`,
        [d.id]
      );

      const [[factors]] = await db.query(
        `SELECT * FROM negative_factors WHERE district_id = ? ORDER BY factor_date DESC LIMIT 1`,
        [d.id]
      );

      const [trendRows] = await db.query(
        `SELECT overall FROM district_scores WHERE district_id = ? ORDER BY year DESC, score_date DESC LIMIT 4`,
        [d.id]
      );

      const [actions] = await db.query(
        `SELECT * FROM actions WHERE district_id = ? ORDER BY FIELD(priority,'high','medium','low'), created_at DESC`,
        [d.id]
      );

      result.push({
        id: d.id,
        name: d.name,
        coordinates: [Number(d.lat), Number(d.lng)],
        radius: d.radius,
        scores: scores
          ? {
              infrastructure: Number(scores.infrastructure),
              environment: Number(scores.environment),
              social: Number(scores.social),
              transportation: Number(scores.transportation),
              security: Number(scores.security),
              education: Number(scores.education),
              health: Number(scores.health),
              overall: Number(scores.overall),
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
        negativeFactors: factors
          ? {
              uncontrolledMigration: Number(factors.uncontrolled_migration),
              informalSettlement: Number(factors.informal_settlement),
              crimeRate: Number(factors.crime_rate),
              trafficCongestion: Number(factors.traffic_congestion),
              noisePollution: Number(factors.noise_pollution),
              airPollution: Number(factors.air_pollution),
            }
          : {
              uncontrolledMigration: 0,
              informalSettlement: 0,
              crimeRate: 0,
              trafficCongestion: 0,
              noisePollution: 0,
              airPollution: 0,
            },
        trendData: trendRows.map(t => Number(t.overall)),
        recommendedActions: actions.map(a => ({
          action: a.action,
          category: a.category,
          potentialScore: Number(a.potential_score),
          priority: a.priority,
          budget: a.budget,
          durationMonths: a.duration_months,
          status: a.status,
        })),
      });
    }

    res.json(result);
  } catch (err) {
    console.error("DISTRICT API HATASI:", err);
    res.status(500).json({ error: "District verileri alınamadı" });
  }
});

app.listen(API_PORT, () => {
  console.log(`🚀 Backend çalışıyor → http://localhost:${API_PORT}`);
});
