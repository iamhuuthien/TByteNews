import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import styles from '../../styles/postDetail.module.css';

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      await fetchPost();
    })();
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

      await supabase.rpc('increment_views', { row_id: id });
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner />
      </div>
    );

  if (!post)
    return (
      <div className={styles.noPost}>Không tìm thấy bài viết</div>
    );

  const plainTextContent = post.content.replace(/<[^>]+>/g, '').substring(0, 150);

  return (
    <>
      <Head>
        <title>{post.title} - TByteNews</title>
        <meta name="description" content={plainTextContent} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={plainTextContent} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
      </Head>
      <div className={styles.pageWrapper}>
        <div className={styles.postDetailCard}>
          <div className={styles.backButtonWrapper}>
            <button
              onClick={() => router.back()}
              className={styles.backCircleButton}
              title="Quay về trang chủ"
              aria-label="Quay về trang chủ"
            >
              <span className={styles.backIcon}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M14 5L8 11L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.backText}>Quay về trang chủ</span>
            </button>
          </div>
          <div className={styles.postDetailHeader}>
            <img
              src={post.thumbnail || '/default-avatar.png'}
              alt="Thumbnail"
              className={styles.postAvatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/48";
              }}
            />
            <div>
              <h1 className={styles.postTitle}>{post.title}</h1>
              <div className={styles.postMetaInfo}>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>
                  {post.views || 0} lượt xem
                  <span className={styles.postBadge}>Hot</span>
                </span>
              </div>
            </div>
          </div>
          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt={post.title}
              className={styles.postImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x350";
              }}
            />
          )}
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
              className={`${styles.shareButton} ${styles.twitterShare}`}
              aria-label="Chia sẻ Twitter"
            >
              <span className={styles.shareText}>Chia sẻ Twitter</span>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                  '_blank'
                )
              }
              className={`${styles.shareButton} ${styles.facebookShare}`}
              aria-label="Chia sẻ Facebook"
            >
              <span className={styles.shareText}>Chia sẻ Facebook</span>
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                  '_blank'
                )
              }
              className={`${styles.shareButton} ${styles.linkedinShare}`}
              aria-label="Chia sẻ LinkedIn"
            >
              <span className={styles.shareText}>Chia sẻ LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;