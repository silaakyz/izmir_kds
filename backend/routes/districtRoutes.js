import express from "express";
import { getDistricts } from "../services/districtService.js";

const router = express.Router();

router.get("/districts-full", async (req, res) => {
  try {
    const data = await getDistricts();
    res.json(data);
  } catch (err) {
    console.error("DISTRICT API HATASI:", err);
    res.status(500).json({ error: "District verileri alınamadı" });
  }
});

export default router;
