import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/adminModal.module.css';

interface EditPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    thumbnail: string;
    thumbnailFile: File | null;
  }) => Promise<void>;
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

  const titleRef = useRef<HTMLInputElement | null>(null);
  const prevActiveEl = useRef<Element | null>(null);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setThumbnail(editData.thumbnail || '');
      setThumbnailFile(null);
    }
  }, [editData, visible]);

  // autofocus when modal opens and preserve focus restore
  useEffect(() => {
    if (visible) {
      prevActiveEl.current = document.activeElement;
      setTimeout(() => titleRef.current?.focus(), 50);
    } else {
      (prevActiveEl.current as HTMLElement | null)?.focus?.();
    }
  }, [visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content, thumbnail, thumbnailFile });
    onClose();
  };

  if (!visible) return null;

  const onOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      onKeyDown={onOverlayKeyDown}
      role="presentation"
      aria-hidden={!visible}
    >
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-post-title"
        onClick={e => e.stopPropagation()}
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Đóng chỉnh sửa"
          type="button"
        >
          ×
        </button>

        <h2 id="edit-post-title" style={{ marginTop: 0 }}>Sửa bài viết</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="edit-title" className={styles.formLabel}>Tiêu đề</label>
            <input
              id="edit-title"
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={styles.formControl}
              placeholder="Tiêu đề bài viết"
              required
              maxLength={200}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-content" className={styles.formLabel}>Nội dung</label>
            <textarea
              id="edit-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              className={styles.formControl}
              placeholder="Nội dung bài viết"
              required
              rows={6}
              maxLength={10000}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-thumbnail" className={styles.formLabel}>Ảnh thumbnail (URL)</label>
            <input
              id="edit-thumbnail"
              type="url"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              className={styles.formControl}
              placeholder="https://..."
              aria-describedby="edit-thumb-help"
            />
            <small id="edit-thumb-help" style={{ display: 'block', marginTop: 6, color: 'var(--muted-color)' }}>
              Để trống nếu muốn giữ ảnh hiện tại
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-file" className={styles.formLabel}>Hoặc upload ảnh thumbnail</label>
            <input
              id="edit-file"
              type="file"
              accept="image/*"
              onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
              className={styles.formControl}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;