import React, { useEffect, useState } from 'react';
import PostCard from '../components/ui/PostCard';
import supabase from '../utils/supabaseClient';
import styles from '../styles/main.module.css';
import { useTranslation } from '../locales/useTranslation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Icon from '../components/ui/Icon';
import { Home, Inbox, Loader } from 'lucide-react';

const CACHE_KEY = 'posts_cache';
const CACHE_EXPIRE = 10000; // 10 giây

const HomePage = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            // Kiểm tra cache
            const cache = localStorage.getItem(CACHE_KEY);
            if (cache) {
                const { data, timestamp } = JSON.parse(cache);
                if (Date.now() - timestamp < CACHE_EXPIRE) {
                    setPosts(data);
                    setLoading(false);
                    return;
                }
            }
            // Nếu không có cache hoặc cache hết hạn, gọi API
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Supabase error:', error.message);
            } else {
                setPosts(data || []);
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: data || [],
                    timestamp: Date.now()
                }));
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon icon={Home} className="text-current" size={28} />
                {t('homeTitle')}
            </h1>
             {loading ? (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Icon icon={Loader} className="animate-spin" size={20} />
                  <LoadingSpinner />
                </div>
             ) : posts.length === 0 ? (
                <div className={styles.noPosts} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon icon={Inbox} size={18} />
                  {t('noPosts')}
                </div>
             ) : (
                <div className={styles.postsGrid}>
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            content={post.content}
                            thumbnail={post.thumbnail}
                            views={post.views}
                            created_at={post.created_at}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;