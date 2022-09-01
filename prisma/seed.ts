(async () => {
  const { PrismaClient } = await import('@prisma/client');
  const { nanoid } = await import('nanoid');

  const prisma = new PrismaClient();

  await Promise.all([
    prisma.apiKeys.create({
      data: {
        key: nanoid(24)
      }
    }),
  ]);

  // eslint-disable-next-line no-console
  console.log('DB seeded');
})();
