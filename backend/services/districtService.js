import { db } from "../db.js";

export async function getDistricts() {
  const [rows] = await db.query(`
    SELECT
      id,
      name,
      code,
      lat,
      lng,
      radius,
      population,
      area_km2,
      density,
      region_type
    FROM districts
    ORDER BY name ASC
  `);

  return rows;
}
