/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

import { ApiKeys, Shorted } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { AnySchema } from 'yup';
import prisma from './database';

export class AccessKeyHelper<T extends ApiKeys | Shorted = ApiKeys> {
  public instance: T;

  constructor(ins: T) {
    this.instance = ins;
  }

  save() {
    const data = {
      data: this.instance,
      where: {
        id: this.instance.id,
      }
    };

    if ((this.instance as Shorted).accessToken) {
      return prisma.shorted.update(data);
    }

    return prisma.apiKeys.update(data);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseUtil = (res: NextApiResponse, status: number, data: Record<string, any> = {}) => res.status(status ?? 200).json({ ...data, ok: status >= 200 && status < 400, status });
export const getKey = async (req: NextApiRequest) => {
  if (!req.headers.authorization) return null;

  const [, key] = req.headers.authorization.split(' ');

  const instance = await prisma.apiKeys.findFirst({
    where: {
      key
    }
  });

  if (!key) return null;
  if (!instance) {
    const access = await prisma.shorted.findFirst({
      where: {
        accessToken: key
      }
    });

    if (!access) return null;

    return new AccessKeyHelper(access);
  }

  return new AccessKeyHelper(instance);
};

export const runValidator = async (res: NextApiResponse, validator: AnySchema, body: any) => {
  try {
    await validator.validate(body);

    return true;
  } catch (error: any) {
    responseUtil(res, 422, { message: 'Invalid request', error: { path: error?.path, errors: error?.errors } });

    return false;
  }
};
