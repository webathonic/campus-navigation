const { Pool } = require("pg");
require("dotenv").config();

const mycon = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Max connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail if connection takes >2s
  // options: "-c search_path=data",
});

async function queryWithPool() {
  try {
    const res = await mycon.query("SELECT * FROM oau_poi WHERE id = $1", [1]);
    console.log("blocks-1:", res.rows[0]);
  } catch (err) {
    console.error("Error:", err);
  }
}

queryWithPool();

module.exports = mycon;
