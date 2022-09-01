import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import morgan from 'morgan';
import { responseUtil } from '../helper';

const connector = () => nc<NextApiRequest, NextApiResponse>({
  onError: (_, __, res) => responseUtil(res, 500, { message: 'Something went wrong' }),
  onNoMatch: (_, res) => responseUtil(res, 404, { message: 'Not found' })
})
  .use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'short'));

export default connector;
