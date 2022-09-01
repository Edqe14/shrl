import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../database';
import { responseUtil } from './helper';

const connector = () => nc<NextApiRequest, NextApiResponse>({
  onError: (_, __, res) => responseUtil(res, 500, { message: 'Something went wrong' }),
  onNoMatch: (_, res) => responseUtil(res, 404, { message: 'Not found' })
}).use(async (req, res, next) => {
  if (!req.headers.authorization) return responseUtil(res, 401, { message: 'Unauthorized' });

  const [type, key] = req.headers.authorization.split(' ');
  if (type.toLowerCase() !== 'bearer' || !(await prisma.apiKeys.count({ where: { key } }))) return responseUtil(res, 401, { message: 'Unauthorized' });

  next();
});

export default connector;
