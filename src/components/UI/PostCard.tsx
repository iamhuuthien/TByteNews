import React from 'react';
import Link from 'next/link';
import styles from '../../styles/main.module.css';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  views: number;
  created_at: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  thumbnail,
  views,
  created_at
}) => {
  const summary = content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

  return (
    <Link href={`/posts/${id}`}>
      <div className={styles.postCard}>
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className={styles.thumbnail}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/300x200";
            }}
          />
        )}
        <h2 className={styles.postTitle}>{title}</h2>
        <p className={styles.postSummary}>{summary}</p>
        <div className={styles.postMeta}>
          <span className={styles.postDate}>
            {new Date(created_at).toLocaleDateString()}
          </span>
          <span className={styles.postViews}>{views || 0} views</span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;