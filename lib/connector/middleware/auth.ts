import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { responseUtil } from '@/lib/helper';
import prisma from '@/lib/database';

const apiKeyMiddleware = (ignoreAdvancedCheck = false) => async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  if (!req.headers.authorization) return responseUtil(res, 401, { message: 'Unauthorized' });

  const [type, key] = req.headers.authorization.split(' ');

  if (type.toLowerCase() === 'bearer' && ignoreAdvancedCheck) return next();

  const instance = await prisma.apiKeys.findFirst({
    where: {
      key
    }
  });

  if (type.toLowerCase() !== 'bearer' || !instance) return responseUtil(res, 401, { message: 'Unauthorized' });

  await prisma.apiKeys.update({
    data: {
      used: instance.used + 1
    },
    where: {
      key
    }
  });

  next();
};

export default apiKeyMiddleware;