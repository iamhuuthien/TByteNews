import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin.module.css';

interface EditPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; thumbnail: string; thumbnailFile: File | null }) => Promise<void>;
  loading: boolean;
  editData: {
    title?: string;
    content?: string;
    thumbnail?: string;
  } | null;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  editData
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setThumbnail(editData.thumbnail || '');
      setThumbnailFile(null);
    }
  }, [editData, visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content, thumbnail, thumbnailFile });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <h2 style={{ marginTop: 0 }}>Sửa bài viết</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={styles.formControl}
              placeholder="Tiêu đề bài viết"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Nội dung</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className={styles.formControl}
              placeholder="Nội dung bài viết"
              required
              rows={6}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Ảnh thumbnail (URL)</label>
            <input
              type="text"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              className={styles.formControl}
              placeholder="URL ảnh thumbnail"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hoặc upload ảnh thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
              className={styles.formControl}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;