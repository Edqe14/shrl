/* eslint-disable import/prefer-default-export */

import { NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseUtil = (res: NextApiResponse, status: number, data: Record<string, any> = {}) => res.status(status ?? 200).json({ ...data, ok: status >= 200 && status < 400, status });
