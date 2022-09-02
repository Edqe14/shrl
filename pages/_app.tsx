import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SHRL</title>
      </Head>

      <ToastContainer theme="colored" />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
