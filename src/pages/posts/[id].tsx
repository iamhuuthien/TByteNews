import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import styles from '../../styles/postDetail.module.css';
import * as createDOMPurifyModule from 'isomorphic-dompurify';

const createDOMPurify = (createDOMPurifyModule as any).default ?? createDOMPurifyModule;
const DOMPurify = createDOMPurify(globalThis as any);

interface Post {
  id: string;
  title: string;
  content: string;
  thumbnail?: string | null;
  created_at: string;
  views?: number | null;
}

const PostDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const postId = Array.isArray(id) ? id[0] : id;

    const fetchPost = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const res = await supabase
          .from('posts')
          .select('id, title, content, thumbnail, created_at, views')
          .eq('id', postId)
          .single();

        const data = (res as any).data as Post | null;
        const error = (res as any).error;

        if (!isMounted) return;

        if (error) {
          throw error;
        }

        setPost(data || null);

        (async () => {
          try {
            await supabase.rpc('increment_views', { row_id: postId });
          } catch {
            /* ignore */
          }
        })();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load post:', err);
        if (isMounted) {
          setErrorMessage('Không thể tải bài viết. Vui lòng thử lại sau.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPost();

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  if (errorMessage) return <div className={styles.noPost}>{errorMessage}</div>;
  if (!post) return <div className={styles.noPost}>Không tìm thấy bài viết</div>;

  const plainTextContent = post.content.replace(/<[^>]+>/g, '').substring(0, 150);
  const safeHtml = DOMPurify.sanitize(post.content || '', {
    ALLOWED_TAGS: [
      'a','b','i','u','strong','em','p','br','ul','ol','li','h1','h2','h3','img','figure','figcaption','blockquote'
    ],
    ALLOWED_ATTR: ['href','target','rel','src','alt','title','class','style'],
  });

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
          {/* back button + header unchanged */}
          <div className={styles.backButtonWrapper}>
            <button
              onClick={() => router.back()}
              className={styles.backCircleButton}
              title="Quay về trang trước"
              aria-label="Quay về trang trước"
            >
              <span className={styles.backIcon}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M14 5L8 11L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.backText}>Quay về</span>
            </button>
          </div>

          <div className={styles.postDetailHeader}>
            <img
              src={post.thumbnail || '/default-avatar.png'}
              alt="Thumbnail"
              className={styles.postAvatar}
              onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://via.placeholder.com/48'; }}
            />
            <div>
              <h1 className={styles.postTitle}>{post.title}</h1>
              <div className={styles.postMetaInfo}>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>
                  {post.views ?? 0} lượt xem
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
              onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://via.placeholder.com/800x350'; }}
            />
          )}

          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: safeHtml }} />

          <div className={styles.shareButtons}>
            {/* share buttons unchanged */}
            <button
              onClick={() =>
                typeof window !== 'undefined' &&
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              className={`${styles.shareButton} ${styles.twitterShare}`}
              aria-label="Chia sẻ Twitter"
            >
              <span className={styles.shareText}>Chia sẻ Twitter</span>
            </button>

            <button
              onClick={() =>
                typeof window !== 'undefined' &&
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              className={`${styles.shareButton} ${styles.facebookShare}`}
              aria-label="Chia sẻ Facebook"
            >
              <span className={styles.shareText}>Chia sẻ Facebook</span>
            </button>

            <button
              onClick={() =>
                typeof window !== 'undefined' &&
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                  '_blank',
                  'noopener,noreferrer'
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