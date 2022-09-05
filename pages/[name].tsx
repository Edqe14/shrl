import { GetServerSideProps } from 'next';
import prisma from '@/lib/database';

interface Props {
  url: string;
  name: string;
}

export default function Name({ url }: Props) {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <h1>Redirecting to <span className="font-bold underline underline-offset-8 decoration-primary decoration-2">{url}</span></h1>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { name } = ctx.query;
  if (!name) {
    return {
      notFound: true
    };
  }

  const instance = await prisma.shorted.findFirst({
    where: {
      name: name as string
    }
  });

  if (!instance) {
    return {
      notFound: true
    };
  }

  ctx.res.setHeader('Location', instance.url);
  ctx.res.statusCode = 301;

  return {
    props: {
      url: instance.url,
      name: instance.name
    },
  };
};