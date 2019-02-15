import mysql from "mysql";

const dbConnection: mysql.Pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  debug: false
});

export default dbConnection;