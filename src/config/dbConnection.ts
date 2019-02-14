import mysql from "mysql";

const dbConnection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

dbConnection.connect(() => console.log("Connect to MySQL"));

export default dbConnection;