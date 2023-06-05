import { PrismaClient } from '@prisma/client';
const databaseHelper = new PrismaClient();
const TEST_DATABASE_SCHEMA_NAME = process.env.DATABASE_SCHEMA_NAME || 'test';

//should be implemented in BeforeEach hook
export const cleanupDatabase = async () => {
  let tableNames = await __getTables(databaseHelper);
  await __removeAllTableContent(databaseHelper, tableNames);
};

//should be implemented in AfterEach hook
export const tearDownDatabase = async () => {
  await databaseHelper.$disconnect();
};

async function __getTables(prisma: PrismaClient): Promise<string[]> {
  const results: Array<{
    tablename: string;
  }> =
    await prisma.$queryRaw`SELECT tablename from pg_tables where schemaname = '${TEST_DATABASE_SCHEMA_NAME}';`;
  return results.map(result => result.tablename);
}

const __removeAllTableContent = async (prisma: PrismaClient, tableNames: Array<string>) => {
  for (const table of tableNames) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${TEST_DATABASE_SCHEMA_NAME}."${table}" CASCADE;`);
  }
};
