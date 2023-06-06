import { PostgreSqlContainer, StartedPostgreSqlContainer } from 'testcontainers';
import console from 'console';
import { TestGlobal } from '@/test/test-global';

module.exports = async () => {
  const container = await new PostgreSqlContainer().withDatabase('test').start();
  process.env.TEST_DATABASE_SCHEMA_NAME = container.getDatabase();
  process.env.DB_URL = container.getConnectionUri();
  console.log('\nStarting database container on: ' + container.getConnectionUri());

  await runPrismaMigrations();

  (globalThis as TestGlobal).__DB_CONTAINER__ = container;
};

const runPrismaMigrations = async () => {
  const { execSync } = require('child_process');
  try {
    execSync('npx prisma migrate dev --preview-feature', { stdio: 'inherit' });
  } catch (error) {
    console.error('Prisma migration failed:');
    console.error(error);
  }
};
