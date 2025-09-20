import React from 'react';
import Link from 'next/link';
import styles from '../../styles/main.module.css';
import Icon from './Icon';
import { Newspaper, Eye, Calendar } from 'lucide-react';

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
  // Xử lý tóm tắt: strip HTML, lấy 150 ký tự đầu
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
        <h2 className={styles.postTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon icon={Newspaper} className="text-current" size={18} />
          </span>
          {title}
        </h2>
        <p className={styles.postSummary}>{summary}</p>
        <div className={styles.postMeta}>
          <span className={styles.postDate}>
            <Icon icon={Calendar} className="text-current" size={14} /> {new Date(created_at).toLocaleDateString()}
          </span>
          <span className={styles.postViews}>
            <Icon icon={Eye} className="text-current" size={14} /> {views || 0} lượt xem
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;