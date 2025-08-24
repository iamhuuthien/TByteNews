import React, { useEffect, useState } from 'react';
import PostCard from '../components/UI/PostCard';
import supabase from '../utils/supabaseClient';
import styles from '../styles/main.module.css';

const HomePage = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Supabase error:', error.message);
            } else {
                setPosts(data || []);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>TByte News</h1>
            {loading ? (
                <div className={styles.loading}>Đang tải bài viết...</div>
            ) : posts.length === 0 ? (
                <div className={styles.noPosts}>Chưa có bài viết nào.</div>
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