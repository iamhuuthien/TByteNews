import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Exclude Layout for Admin Login Page
  const isAdminLoginPage = router.pathname === '/admin/login';
  
  if (isAdminLoginPage) {
    return <Component {...pageProps} />;
  }
  
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;