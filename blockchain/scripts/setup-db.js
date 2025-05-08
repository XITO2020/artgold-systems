const { Pool } = require('pg');
const { execSync } = require('child_process');

async function setupDatabase() {
  try {
    // Initialize connection pool
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: true
    });

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    // Generate Prisma client
    execSync('prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully');

    // Close pool
    await pool.end();
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
}

setupDatabase();