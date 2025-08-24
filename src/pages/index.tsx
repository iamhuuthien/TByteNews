import React, { useEffect, useState } from 'react';
import PostCard from '../components/UI/PostCard';
import supabase from '../utils/supabaseClient';
import styles from '../styles/main.module.css';
import { useTranslation } from '../locales/useTranslation';
import LoadingSpinner from '../components/UI/LoadingSpinner';

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
            <h1 className={styles.pageTitle}>{t('homeTitle')}</h1>
            {loading ? (
                <LoadingSpinner />
            ) : posts.length === 0 ? (
                <div className={styles.noPosts}>{t('noPosts')}</div>
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