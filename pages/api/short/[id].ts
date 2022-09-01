import { Shorted } from '@prisma/client';
import connector from '@/lib/connector';
import { getKey, responseUtil, runValidator } from '@/lib/helper';
import prisma from '@/lib/database';
import { optionalShorterValidator } from '@/lib/validators/shorter';
import auth from '@/lib/connector/middleware/auth';

export default connector()
  .use(auth(true))
  .get(async (req, res) => {
    try {
      const key = await getKey(req);
      if (!key) return responseUtil(res, 401);

      const all = await prisma.shorted.findFirstOrThrow({
        select: {
          id: true,
          name: true,
          createdAt: true,
          url: true,
          updatedAt: true,
        },
        where: {
          id: req.query.id as string,
          deleted: false,
          OR: {
            apiKeyId: key.instance.id,
            accessToken: (key.instance as Shorted).accessToken
          }
        }
      });

      return responseUtil(res, 200, { data: all });
    } catch {
      return responseUtil(res, 404, { message: 'Not found' });
    }
  })
  .put(async (req, res) => {
    try {
      const key = await getKey(req);
      if (!key) return responseUtil(res, 401);
      if (!(await runValidator(res, optionalShorterValidator, req.body))) return false;

      const { name, url } = optionalShorterValidator.cast(req.body);

      if (!(await prisma.shorted.count({
        where: {
          id: req.query.id as string,
          deleted: false,
          OR: {
            apiKeyId: key.instance.id,
            accessToken: (key.instance as Shorted).accessToken
          }
        }
      }))) throw new Error('Not found');

      const all = await prisma.shorted.update({
        data: {
          url,
          name
        },
        where: {
          id: req.query.id as string,
        },
        select: {
          id: true,
          name: true,
          url: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return responseUtil(res, 200, { data: all });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return responseUtil(res, 404, { message: e.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const key = await getKey(req);
      if (!key) return responseUtil(res, 401);
      if (!(await prisma.shorted.count({
        where: {
          id: req.query.id as string,
          deleted: false,
          OR: {
            apiKeyId: key.instance.id,
            accessToken: (key.instance as Shorted).accessToken
          }
        }
      }))) throw new Error('Not found');

      const all = await prisma.shorted.delete({
        where: {
          id: req.query.id as string,
        }
      });

      return responseUtil(res, 200, { data: all });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return responseUtil(res, 404, { message: e.message });
    }
  });