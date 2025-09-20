import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/adminModal.module.css';
import RichTextEditor from '../Editor/RichTextEditor';
import * as createDOMPurifyModule from 'isomorphic-dompurify';
const createDOMPurify = (createDOMPurifyModule as any).default ?? createDOMPurifyModule;
const DOMPurify = createDOMPurify(globalThis as any);

interface AddPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    thumbnail: string;
    thumbnailFile: File | null;
  }) => Promise<void>;
  loading: boolean;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ visible, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; content?: string; thumbnail?: string }>({});

  const titleRef = useRef<HTMLInputElement | null>(null);
  const prevActiveEl = useRef<Element | null>(null);

  useEffect(() => {
    if (visible) {
      prevActiveEl.current = document.activeElement;
      setTimeout(() => titleRef.current?.focus(), 40);
    } else {
      (prevActiveEl.current as HTMLElement | null)?.focus?.();
      setTitle(''); setContent(''); setThumbnail(''); setThumbnailFile(null); setPreview(null); setErrors({});
    }
  }, [visible]);

  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [thumbnailFile]);

  const validate = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = 'Tiêu đề bắt buộc';
    const plain = content.replace(/<[^>]*>?/gm, '').trim();
    if (!plain) e.content = 'Nội dung bắt buộc';
    if (thumbnail && !/^https?:\/\/.+/.test(thumbnail)) e.thumbnail = 'URL không hợp lệ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // sanitize HTML: allow basic formatting, links, images
    const clean = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'a','b','i','u','strong','em','p','br','ul','ol','li','h1','h2','h3','img','figure','figcaption','blockquote'
      ],
      ALLOWED_ATTR: ['href','target','rel','src','alt','title','class','style'],
    });
    await onSubmit({ title, content: clean, thumbnail, thumbnailFile });
    // reset and close
    setTitle(''); setContent(''); setThumbnail(''); setThumbnailFile(null); setPreview(null);
    onClose();
  };

  const onOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!visible) return null;

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
        aria-labelledby="add-post-title"
        onClick={e => e.stopPropagation()}
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Đóng"
          type="button"
        >
          ×
        </button>

        <h2 id="add-post-title" style={{ marginTop: 0 }}>Thêm bài viết mới</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="add-title" className={styles.formLabel}>Tiêu đề</label>
            <input
              id="add-title"
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={styles.formControl}
              placeholder="Tiêu đề bài viết"
              required
              maxLength={200}
            />
            {errors.title && <div className={styles.formError} role="alert">{errors.title}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="add-content" className={styles.formLabel}>Nội dung</label>
            <RichTextEditor value={content} onChange={setContent} />
            {errors.content && <div className={styles.formError} role="alert">{errors.content}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="add-thumbnail" className={styles.formLabel}>Ảnh thumbnail (URL)</label>
            <input
              id="add-thumbnail"
              type="url"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              className={styles.formControl}
              placeholder="https://..."
              aria-describedby="thumb-help"
            />
            <small id="thumb-help" style={{ display: 'block', marginTop: 6, color: 'var(--muted-color)' }}>
              Bỏ trống để upload file hoặc giữ nguyên sau khi tạo
            </small>
            {errors.thumbnail && <div className={styles.formError} role="alert">{errors.thumbnail}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Hoặc upload ảnh thumbnail</label>
            <label htmlFor="add-file" className={styles.fileUpload}>Chọn file</label>
            <input
              id="add-file"
              type="file"
              accept="image/*"
              onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            {preview && <img src={preview} alt="Thumbnail preview" className={styles.filePreview} />}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo bài viết'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPostModal;