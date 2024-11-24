const { execSync } = require('child_process');

async function main() {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log('Skipping Prisma generation in production');
      return;
    }

    console.log('Setting up database...');

    // Generate Prisma Client without engine download
    console.log('Generating Prisma Client...');
    execSync('prisma generate --no-engine', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_CLIENT_ENGINE_TYPE: 'library',
        PRISMA_CLI_QUERY_ENGINE_TYPE: 'library'
      }
    });

    console.log('✓ Setup completed successfully');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(0);
  }
}

main();