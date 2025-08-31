import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import styles from '../../styles/admin.module.css';
import Head from 'next/head';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push('/admin');
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/admin');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return setMessage({ type: 'error', text: 'Vui lòng nhập email.' });
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMessage({ type: 'error', text: error.message });
    else setMessage({ type: 'success', text: 'Đã gửi email đặt lại mật khẩu!' });
    setLoading(false);
  };

  return (
    <>
      <Head><title>Admin Login - TByteNews</title></Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>Admin Login</h1>
          {message && <p className={`${message.type === 'error' ? styles.errorMessage : styles.successMessage}`}>{message.text}</p>}
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className={styles.loginButton} disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
            <button type="button" className={styles.loginButton} style={{ marginTop: 8, background: '#2196f3' }} onClick={handleResetPassword} disabled={loading}>Quên mật khẩu</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
