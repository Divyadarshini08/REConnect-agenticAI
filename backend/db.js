import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "reconnect_user",
  password: "reconnect123",
  database: "reconnect",
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;
