import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import styles from '../../styles/admin.module.css';
import Head from 'next/head';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/admin');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/admin');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Vui lòng nhập email để lấy lại mật khẩu.');
      return;
    }
    setLoading(true);
    setError(null);
    setResetSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setResetSent(true);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Admin Login - TByteNews</title>
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>Admin Login</h1>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {resetSent && (
            <p className={styles.successMessage}>
              Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.
            </p>
          )}
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <button
              type="button"
              className={styles.loginButton}
              style={{ marginTop: 10, background: '#2196f3' }}
              onClick={handleResetPassword}
              disabled={loading}
            >
              Quên mật khẩu
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;