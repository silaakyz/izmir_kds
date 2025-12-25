import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // phpMyAdmin şifren
  database: "luxcivic_izmir",
  waitForConnections: true,
  connectionLimit: 10,
});
