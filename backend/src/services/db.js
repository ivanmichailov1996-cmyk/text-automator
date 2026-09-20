import pg from 'pg';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable');
}

// Create a connection pool using DATABASE_URL with pooler
const pool = new Pool({
  connectionString: databaseUrl,
  // Pooler-specific settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const getOrCreateUser = async (telegramId, username, firstName) => {
  const client = await pool.connect();
  try {
    // Try to get existing user
    const result = await client.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new user if doesn't exist
    const insertResult = await client.query(
      'INSERT INTO users (telegram_id, username, first_name) VALUES ($1, $2, $3) RETURNING *',
      [telegramId, username, firstName]
    );

    return insertResult.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const saveToHistory = async (userId, type, inputText, outputText, language = 'ru') => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO history (user_id, type, input_text, output_text, language) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, type, inputText, outputText, language]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getHistory = async (userId, limit = 50) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const deleteHistoryItem = async (itemId) => {
  const client = await pool.connect();
  try {
    await client.query(
      'DELETE FROM history WHERE id = $1',
      [itemId]
    );

    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
