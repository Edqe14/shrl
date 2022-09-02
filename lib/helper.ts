/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

import { ApiKeys, Shorted } from '@prisma/client';
import camelcase from 'camelcase';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';
import { adjectives, animals, colors, languages, uniqueNamesGenerator } from 'unique-names-generator';
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
    return prisma.apiKeys.update(data);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseUtil = (res: NextApiResponse, status: number, data: Record<string, any> = {}) => res.status(status ?? 200).json({ ...data, ok: status >= 200 && status < 400, status });
export const getKey = async (req: NextApiRequest) => {
  if (!req.headers.authorization) return null;

  const [type , key] = req.headers.authorization.split(' ');
  if (!type || !key || type.toLocaleLowerCase() !== 'bearer') return null;

  const instance = await prisma.apiKeys.findFirst({
    where: {
      key
    }
  });

  if (!instance) return null;

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

export const generateRandomName = () => `${camelcase(uniqueNamesGenerator({
  dictionaries: [adjectives, colors, languages, animals],
}), { pascalCase: true }) }-${ nanoid(8)}`;
