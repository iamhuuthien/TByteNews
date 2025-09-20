import React, { useEffect, useRef, useState } from 'react';
import supabase from '../../utils/supabaseClient';
import { getAdminProfile, updateAdminProfile } from '../../utils/fetchAdminProfile';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from '../../styles/adminModal.module.css';

const initialProfile = {
  name: '',
  job_title: '',
  email: '',
  avatar_url: '',
  github: '',
  linkedin: '',
  youtube: '',
  bio: '',
};

interface AdminProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ visible, onClose }) => {
  const [profile, setProfile] = useState<any>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isNew, setIsNew] = useState(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const prevActiveEl = useRef<Element | null>(null);

  useEffect(() => {
    if (visible) {
      prevActiveEl.current = document.activeElement;
      setLoading(true);
      getAdminProfile()
        .then(data => {
          if (data) {
            setProfile(data);
            setIsNew(false);
          } else {
            setProfile(initialProfile);
            setIsNew(true);
          }
        })
        .catch(() => {
          setProfile(initialProfile);
          setIsNew(true);
        })
        .finally(() => setLoading(false));
      setTimeout(() => nameRef.current?.focus(), 40);
    } else {
      (prevActiveEl.current as HTMLElement | null)?.focus?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // preview avatar file (show local preview)
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [avatarFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return profile?.avatar_url;
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `avatar_${profile?.email || profile?.id || Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true });
    if (error) {
      setMessage('Lỗi upload ảnh: ' + error.message);
      return profile?.avatar_url;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data?.publicUrl || profile?.avatar_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const avatar_url = await handleAvatarUpload();
      let updated;
      if (isNew) {
        const { data, error } = await supabase
          .from('admin_profile')
          .insert([{ ...profile, avatar_url, updated_at: new Date().toISOString() }])
          .select()
          .single();
        if (error) throw error;
        updated = data;
        setIsNew(false);
      } else {
        updated = await updateAdminProfile({ ...profile, avatar_url });
      }
      setProfile(updated);
      setMessage('Cập nhật thành công!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setMessage('Có lỗi: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const onOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!visible) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={styles.profileModalOverlay}
      onClick={onClose}
      onKeyDown={onOverlayKeyDown}
      tabIndex={-1}
      role="presentation"
      aria-hidden={!visible}
    >
      <div
        className={styles.profileModalContent}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-profile-title"
      >
        <div className={styles.profileModalHeader}>
          <h2 id="admin-profile-title" className={styles.profileModalTitle}>
            {isNew ? 'Thêm thông tin admin' : 'Chỉnh sửa thông tin cá nhân'}
          </h2>
          <button
            className={styles.profileModalClose}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.profileAvatarWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <img
              src={preview || profile?.avatar_url || '/profile-image.jpg'}
              alt={profile?.name ? `${profile.name} avatar` : 'Avatar'}
              className={styles.profileAvatar}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/110';
              }}
            />
            <label htmlFor="avatarFile" className="fileUpload" style={{ cursor: 'pointer' }}>
              Chọn ảnh
            </label>
            <input
              id="avatarFile"
              type="file"
              accept="image/*"
              onChange={e => setAvatarFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              aria-label="Upload avatar"
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              ref={nameRef}
              type="text"
              name="name"
              value={profile?.name || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              required
              placeholder="Nhập họ tên"
              maxLength={100}
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="job_title">Nghề nghiệp</label>
            <input
              id="job_title"
              type="text"
              name="job_title"
              value={profile?.job_title || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              required
              placeholder="VD: Software Engineer"
              maxLength={80}
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={profile?.email || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              required
              placeholder="Nhập email"
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profile?.bio || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              rows={3}
              placeholder="Giới thiệu ngắn về bạn"
              maxLength={500}
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="github">GitHub</label>
            <input
              id="github"
              type="url"
              name="github"
              value={profile?.github || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              id="linkedin"
              type="url"
              name="linkedin"
              value={profile?.linkedin || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className={styles.profileFormGroup}>
            <label htmlFor="youtube">YouTube</label>
            <input
              id="youtube"
              type="url"
              name="youtube"
              value={profile?.youtube || ''}
              onChange={handleChange}
              className={styles.profileFormControl}
              placeholder="https://youtube.com/c/yourchannel"
            />
          </div>

          <button
            type="submit"
            className={styles.profileSubmitButton}
            disabled={saving}
            aria-disabled={saving}
          >
            {saving ? 'Đang lưu...' : isNew ? 'Thêm thông tin' : 'Lưu thay đổi'}
          </button>

          {message && (
            <p className={styles.profileErrorMessage} role="status">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminProfileModal;