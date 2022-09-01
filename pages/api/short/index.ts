import { nanoid } from 'nanoid';
import connector from '@/lib/connector';
import { getKey, responseUtil, runValidator } from '@/lib/helper';
import prisma from '@/lib/database';
import shorterValidator from '@/lib/validators/shorter';
import auth from '@/lib/connector/middleware/auth';

export default connector()
  .use(auth())
  .get(async (req, res) => {
    const key = await getKey(req);
    if (!key) return responseUtil(res, 401);

    const all = await prisma.shorted.findMany({
      where: {
        apiKeyId: key.instance.id
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
  })
  .post(async (req, res) => {
    const key = await getKey(req);
    if (!key) return responseUtil(res, 401);

    if (!(await runValidator(res, shorterValidator, req.body))) return false;

    const { name, url } = shorterValidator.cast(req.body);
    if (!url) return responseUtil(res, 422, { message: 'Invalid request' });

    const short = await prisma.shorted.create({
      data: {
        name: name ?? nanoid(8),
        url,
        accessToken: nanoid(24),
        apiKeyId: key.instance.id,
      },
      select: {
        id: true,
        accessToken: true,
        name: true,
        url: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return responseUtil(res, 200, { data: short });
  });