import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPost();
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

  if (loading) return <div style={{ textAlign: 'center', margin: '60px 0', color: '#888' }}>Đang tải bài viết...</div>;
  if (!post) return <div style={{ textAlign: 'center', margin: '60px 0', color: '#888' }}>Không tìm thấy bài viết</div>;

  return (
    <>
      <Head>
        <title>{post.title} - TByteNews</title>
        <meta name="description" content={post.content.substring(0, 150)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 150)} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
      </Head>
      <div style={{ background: 'var(--background-color)', minHeight: '100vh', padding: '32px 0' }}>
        <div className="postDetailCard">
          <button onClick={() => router.push('/')} className="backButton">
            ← Quay về trang chủ
          </button>
          <div className="postDetailHeader">
            <img
              src={post.thumbnail || '/default-avatar.png'}
              alt="Thumbnail"
              className="postAvatar"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/48";
              }}
            />
            <div>
              <h1 className="postTitle">{post.title}</h1>
              <div className="postMetaInfo">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>
                  {post.views || 0} lượt xem
                  <span className="postBadge">Hot</span>
                </span>
              </div>
            </div>
          </div>
          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="postImage"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x350";
              }}
            />
          )}
          <div
            className="postContent"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="shareButtons">
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                  '_blank'
                )
              }
              className="shareButton twitterShare"
            >
              Chia sẻ Twitter
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                  '_blank'
                )
              }
              className="shareButton facebookShare"
            >
              Chia sẻ Facebook
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`,
                  '_blank'
                )
              }
              className="shareButton linkedinShare"
            >
              Chia sẻ LinkedIn
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;