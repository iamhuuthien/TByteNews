import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import '../styles/global.css';
import { TranslationProvider } from '../locales/useTranslation';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminLoginPage = router.pathname === '/admin/login';

  if (isAdminLoginPage) {
    return <Component {...pageProps} />;
  }

  return (
    <TranslationProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TranslationProvider>
  );
}

export default MyApp;