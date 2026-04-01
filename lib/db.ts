import mysql from 'mysql2/promise';

// Prevent connection leaks during Next.js hot reloads in development.
// Without this, every HMR cycle creates a new pool while the old one's
// connections stay open, eventually exhausting MySQL's max_connections.
const globalForDb = globalThis as unknown as {
  __dbPool?: mysql.Pool;
  __dbSchemaReady?: Promise<void>;
};

const pool = globalForDb.__dbPool ?? mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME || 'cite_es',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

async function ensureSchemaCompatibility() {
  const dbName = process.env.DB_NAME || 'cite_es';
  const requiredColumns = [
    { table: 'courses', column: 'is_archived', ddl: 'ALTER TABLE courses ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0' },
    { table: 'evaluations', column: 'is_archived', ddl: 'ALTER TABLE evaluations ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0' },
    { table: 'comments', column: 'is_archived', ddl: 'ALTER TABLE comments ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0' },
    { table: 'comments', column: 'meta_json', ddl: 'ALTER TABLE comments ADD COLUMN meta_json LONGTEXT DEFAULT NULL' },
  ];

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT TABLE_NAME as table_name, COLUMN_NAME as column_name
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?`,
      [dbName]
    );

    const existing = new Set(
      (Array.isArray(rows) ? rows : []).map(
        (r: any) => `${String(r.table_name || '').toLowerCase()}.${String(r.column_name || '').toLowerCase()}`
      )
    );

    for (const col of requiredColumns) {
      const key = `${col.table}.${col.column}`;
      if (!existing.has(key)) {
        await connection.execute(col.ddl);
      }
    }

    // Normalize legacy NULL values so filtering logic behaves predictably.
    await connection.execute('UPDATE courses SET is_archived = 0 WHERE is_archived IS NULL');
    await connection.execute('UPDATE evaluations SET is_archived = 0 WHERE is_archived IS NULL');
    await connection.execute('UPDATE comments SET is_archived = 0 WHERE is_archived IS NULL');
  } finally {
    connection.release();
  }
}

const schemaReady = globalForDb.__dbSchemaReady ?? ensureSchemaCompatibility().catch((error) => {
  // Do not fail app boot because of one-time compatibility bootstrap.
  console.warn('Schema compatibility bootstrap skipped:', error);
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__dbPool = pool;
  globalForDb.__dbSchemaReady = schemaReady;
}

export async function query(sql: string, values?: any[]) {
  await schemaReady;
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = values
        ? await connection.execute(sql, values)
        : await connection.execute(sql);
      return results;
    } finally {
      connection.release();
    }
  } catch (error) {
    const code = (error as any)?.code || '';
    const isConnectivityError =
      code === 'ECONNREFUSED' ||
      code === 'ENOTFOUND' ||
      code === 'ETIMEDOUT' ||
      code === 'PROTOCOL_CONNECTION_LOST';

    if (isConnectivityError) {
      // Keep graceful behavior for infra/network outages.
      console.warn('DB connectivity issue, returning empty result:', error);
      return [];
    }

    throw error;
  }
}

export async function queryOne(sql: string, values?: any[]) {
  const results = await query(sql, values);
  return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

export default pool;
