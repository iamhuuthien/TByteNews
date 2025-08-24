import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import styles from '../../styles/main.module.css';
import Head from 'next/head';

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);

      // Tăng số lượt xem
      await supabase
        .from('posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Head>
        <title>{post.title} - TByteNews</title>
        <meta name="description" content={post.content.substring(0, 150)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 150)} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
      </Head>
      <div className={styles.container}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ← Back to Home
        </button>
        <div className={styles.postHeader}>
          {post.thumbnail && (
            <img src={post.thumbnail} alt={post.title} className={styles.postImage} />
          )}
          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postDate}>
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className={styles.postViews}>{post.views || 0} views</p>
        </div>
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className={styles.shareButtons}>
          <button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                '_blank'
              )
            }
            className={styles.twitterShare}
          >
            Share on Twitter
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                '_blank'
              )
            }
            className={styles.facebookShare}
          >
            Share on Facebook
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                '_blank'
              )
            }
            className={styles.linkedinShare}
          >
            Share on LinkedIn
          </button>
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;