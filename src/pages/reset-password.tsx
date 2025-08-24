import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../utils/supabaseClient';
import styles from '../styles/admin.module.css';
import Head from 'next/head';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      setSuccess(false);
    } else {
      setMessage('Đổi mật khẩu thành công! Đang chuyển về trang quản trị...');
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 2000); // Chuyển trang sau 2 giây
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Đổi mật khẩu - TByteNews</title>
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>Đổi mật khẩu mới</h1>
          {message && (
            <p className={success ? styles.successMessage : styles.errorMessage}>
              {message}
            </p>
          )}
          {!success && (
            <form onSubmit={handleReset}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Mật khẩu mới</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;