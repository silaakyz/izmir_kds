import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   DEMO KULLANICI OLUŞTURMA
================================ */
app.post("/api/demo-user", async (req, res) => {
  try {
    const tc = "12345678901";
    const password = "123456";

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT IGNORE INTO users (tc, password_hash, role) VALUES (?, ?, 'demo')",
      [tc, hash]
    );

    res.json({ success: true, tc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   🔐 LOGIN
================================ */
app.post("/api/login", async (req, res) => {
  try {
    const { tc, password } = req.body;

    if (!tc || !password) {
      return res.status(400).json({ error: "TC ve şifre gerekli" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE tc = ?",
      [tc]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }

    const user = rows[0];

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Şifre yanlış" });
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
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

/* ===============================
   TEST
================================ */
app.get("/api/hello", (req, res) => {
  res.json({ mesaj: "Server çalışıyor" });
});

/* ===============================
   BASİT DISTRICTS (TEST)
================================ */
app.get("/api/districts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM districts");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: "Veritabanı hatası" });
  }
});

/* ===============================
   🔥 FULL DISTRICT DATA (ASİL API)
   Frontend useDistricts.ts burayı çağırır
================================ */
app.get("/api/districts-full", async (req, res) => {
  try {
    const [districts] = await db.query("SELECT * FROM districts");

    const result = [];

    for (const d of districts) {
      const [[scores]] = await db.query(
        "SELECT * FROM district_scores WHERE district_id = ? ORDER BY period_start DESC LIMIT 1",
        [d.id]
      );

      const [[factors]] = await db.query(
        "SELECT * FROM negative_factors WHERE district_id = ? ORDER BY period_start DESC LIMIT 1",
        [d.id]
      );

      const [trendRows] = await db.query(
        "SELECT overall_score FROM trend_data WHERE district_id = ? ORDER BY period_value DESC LIMIT 4",
        [d.id]
      );

      const [actions] = await db.query(
        "SELECT * FROM recommended_actions WHERE district_id = ? ORDER BY priority DESC",
        [d.id]
      );

      result.push({
        id: d.id,
        name: d.name,
        coordinates: [d.latitude, d.longitude],
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
            }
          : {
              uncontrolledMigration: 0,
              informalSettlement: 0,
              crimeRate: 0,
              trafficCongestion: 0,
              noisePollution: 0,
            },
        trendData: trendRows.map(t => Number(t.overall_score)),
        recommendedActions: actions.map(a => ({
          action: a.action,
          potentialScore: Number(a.potential_score),
          priority: a.priority,
          budget: a.budget || "",
        })),
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "District verileri alınamadı" });
  }
});

app.listen(4000, () => {
  console.log("🚀 Server başladı: http://localhost:4000");
});
