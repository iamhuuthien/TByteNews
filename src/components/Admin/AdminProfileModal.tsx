import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';
import { getAdminProfile, updateAdminProfile } from '../../utils/fetchAdminProfile';
import LoadingSpinner from '../UI/LoadingSpinner';
import styles from '../../styles/profile.module.css';

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
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        if (visible) {
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
        }
    }, [visible]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return profile.avatar_url;
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar_${profile.email || profile.id || Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { upsert: true });
        if (error) {
            setMessage('Lỗi upload ảnh: ' + error.message);
            return profile.avatar_url;
        }
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
        return data?.publicUrl || profile.avatar_url;
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
        }
        setSaving(false);
    };

    if (!visible) return null;
    if (loading) return <LoadingSpinner />;

    return (
        <div
            className={styles.profileModalOverlay}
            onClick={onClose}
        >
            <div
                className={styles.profileModalContent}
                onClick={e => e.stopPropagation()}
            >
                <div className={styles.profileModalHeader}>
                    <h2 className={styles.profileModalTitle}>
                        {isNew ? 'Thêm thông tin admin' : 'Chỉnh sửa thông tin cá nhân'}
                    </h2>
                    <button
                        className={styles.profileModalClose}
                        type="button"
                        onClick={onClose}
                        title="Đóng"
                    >×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.profileAvatarWrapper}>
                        <img
                            src={profile.avatar_url || '/profile-image.jpg'}
                            alt="Avatar"
                            className={styles.profileAvatar}
                            onError={e => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/110";
                            }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                            className={styles.profileFormControl}
                            style={{ marginBottom: 8 }}
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>Họ tên</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            required
                            placeholder="Nhập họ tên"
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>Nghề nghiệp</label>
                        <input
                            type="text"
                            name="job_title"
                            value={profile.job_title || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            required
                            placeholder="VD: Software Engineer"
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            required
                            placeholder="Nhập email"
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            rows={3}
                            placeholder="Giới thiệu ngắn về bạn"
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>GitHub</label>
                        <input
                            type="text"
                            name="github"
                            value={profile.github || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            placeholder="https://github.com/yourusername"
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            value={profile.linkedin || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            placeholder="https://linkedin.com/in/yourusername"
                        />
                    </div>
                    <div className={styles.profileFormGroup}>
                        <label>YouTube</label>
                        <input
                            type="text"
                            name="youtube"
                            value={profile.youtube || ''}
                            onChange={handleChange}
                            className={styles.profileFormControl}
                            placeholder="https://youtube.com/c/yourchannel"
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.profileSubmitButton}
                        disabled={saving}
                    >
                        {saving ? 'Đang lưu...' : isNew ? 'Thêm thông tin' : 'Lưu thay đổi'}
                    </button>
                    {message && (
                        <p className={styles.profileErrorMessage}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminProfileModal;