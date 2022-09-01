import { PrismaClient } from '@prisma/client';

// @ts-expect-error GlobalThis
const prisma: PrismaClient = global.prisma ?? new PrismaClient();

// @ts-expect-error GlobalThis
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
