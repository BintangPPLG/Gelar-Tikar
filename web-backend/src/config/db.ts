import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;
let isConnected = false;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'concert_tickets_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function testDbConnection(): Promise<boolean> {
  try {
    const db = getDbPool();
    const connection = await db.getConnection();
    connection.release();
    isConnected = true;
    console.log('✅ [MySQL Database]: Connected successfully to concert_tickets_db');
    return true;
  } catch (error: any) {
    console.warn('⚠️ [MySQL Warning]:', error.message, '-> Using high-performance in-memory sync store.');
    isConnected = false;
    return false;
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.execute(sql, params);
    return rows as T[];
  } catch (error: any) {
    console.warn('[MySQL Query Error]:', error.message);
    throw error;
  }
}
