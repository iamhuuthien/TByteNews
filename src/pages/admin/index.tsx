import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import Head from 'next/head';
import styles from '../../styles/admin.module.css';
import AddPostModal from '../../components/Admin/AddPostModal';
import EditPostModal from '../../components/Admin/EditPostModal';
import AdminProfileModal from '../../components/Admin/AdminProfileModal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ConfirmModal from 'components/UI/ConfirmModal';

const AdminPage: React.FC = () => {
  const router = useRouter();

  // State chung
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace('/admin/login');
      } else {
        setUser(data.user);
        fetchPosts();
      }
    };
    checkUser();
  }, [router]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch {
      setMessage({ type: 'error', text: 'Lỗi tải bài viết!' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (newPost: any) => {
    setLoading(true);
    try {
      await uploadAndInsertPost(newPost);
      setMessage({ type: 'success', text: 'Tạo bài viết mới thành công!' });
      fetchPosts();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Có lỗi khi tạo bài viết' });
    } finally {
      setShowAddModal(false);
      setLoading(false);
    }
  };

  const handleEditPost = (post: any) => {
    setEditData(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = async (updatedPost: any) => {
    setLoading(true);
    try {
      await uploadAndUpdatePost(editData.id, updatedPost);
      setMessage({ type: 'success', text: 'Cập nhật bài viết thành công!' });
      fetchPosts();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Có lỗi khi cập nhật' });
    } finally {
      setShowEditModal(false);
      setEditData(null);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setLoading(true);
    try {
      await supabase.from('posts').delete().eq('id', confirmDelete.id);
      setMessage({ type: 'success', text: 'Xóa bài viết thành công!' });
      fetchPosts();
    } catch {
      setMessage({ type: 'error', text: 'Có lỗi khi xóa bài viết!' });
    } finally {
      setConfirmDelete(null);
      setLoading(false);
    }
  };

  const uploadAndInsertPost = async ({ title, content, thumbnailFile }: any) => {
    let thumbnailUrl = '';
    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('thumbnails').upload(fileName, thumbnailFile);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
      thumbnailUrl = urlData.publicUrl;
    }
    await supabase.from('posts').insert([{ title, content, thumbnail: thumbnailUrl, views: 0 }]);
  };

  const uploadAndUpdatePost = async (id: string, { title, content, thumbnailFile }: any) => {
    let thumbnailUrl = editData.thumbnail || '';
    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('thumbnails').upload(fileName, thumbnailFile);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
      thumbnailUrl = urlData.publicUrl;
    }
    await supabase.from('posts').update({ title, content, thumbnail: thumbnailUrl, updated_at: new Date().toISOString() }).eq('id', id);
  };

  if (!user) return null;

  return (
    <>
      <Head><title>Admin Panel - TByteNews</title></Head>
      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <h1>Admin Dashboard</h1>
          <div className={styles.headerButtons}>
            <button className={styles.primaryButton} onClick={() => setShowAddModal(true)}>✍️ Tạo bài viết</button>
            <button className={styles.secondaryButton} onClick={() => setShowProfileModal(true)}>👤 Thông tin admin</button>
            <button className={styles.dangerButton} onClick={async () => {await supabase.auth.signOut(); router.replace('/admin/login')}}>Đăng xuất</button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsSection}>
          <div className={styles.statCard}><h3>Tổng bài viết</h3><p>{posts.length}</p></div>
          <div className={styles.statCard}><h3>Tổng lượt xem</h3><p>{totalViews}</p></div>
        </div>

        {/* Message */}
        {message && <p className={`${styles.toastMessage} ${message.type === 'success' ? styles.success : styles.error}`}>{message.text}</p>}

        {/* Posts */}
        <div className={styles.postsList}>
          {loading ? <LoadingSpinner /> :
            posts.length === 0 ? <p>Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p> :
            <div className={styles.postsGridAdmin}>
              {posts.map(post => (
                <div key={post.id} className={styles.postBlock}>
                  <img src={post.thumbnail || '/placeholder.png'} alt={post.title} className={styles.postThumbnail} />
                  <div className={styles.postInfo}>
                    <h3>{post.title}</h3>
                    <p>{post.content.replace(/<[^>]*>?/gm, '').substring(0,120)}...</p>
                    <div className={styles.postMeta}>
                      <span>👁️ {post.views || 0}</span>
                      <span>🗓️ {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles.postActions}>
                    <button onClick={() => handleEditPost(post)} className={styles.editButton}>✏️ Sửa</button>
                    <button onClick={() => setConfirmDelete({ id: post.id, title: post.title })} className={styles.deleteButton}>🗑️ Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Modals */}
        <AddPostModal visible={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddPost} loading={loading} />
        {editData && <EditPostModal visible={showEditModal} onClose={() => setShowEditModal(false)} onSubmit={handleUpdatePost} loading={loading} editData={editData} />}
        <AdminProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />
        {confirmDelete && <ConfirmModal visible={!!confirmDelete} title={`Xóa bài viết "${confirmDelete.title}"?`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}
      </div>
    </>
  );
};

export default AdminPage;
