import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.create({
    data: {
      id: 'anonymous',
      email: 'anonymous@omnicalc.app',
      name: 'Anonymous User',
    },
  });
  console.log('Anonymous user created');
}

main()
  .catch(console.error)
  .finally(() => process.exit());
