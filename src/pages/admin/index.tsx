import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import styles from '../../styles/admin.module.css';
import Head from 'next/head';
import AddPostModal from '../../components/Admin/AddPostModal';
import EditPostModal from '../../components/Admin/EditPostModal';
import AdminProfileModal from '../../components/Admin/AdminProfileModal';
import LoadingSpinner from 'components/UI/LoadingSpinner';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Thống kê
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
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      setMessage('Lỗi tải bài viết!');
    } finally {
      setLoading(false);
    }
  };

  // Thêm bài viết mới
  const handleAddPost = async ({ title, content, thumbnail, thumbnailFile }: any) => {
    setLoading(true);
    let thumbnailUrl = thumbnail;
    try {
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, thumbnailFile);
        if (!error) {
          const { data: urlData } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(fileName);
          thumbnailUrl = urlData.publicUrl;
        }
      }
      await supabase
        .from('posts')
        .insert([{ title, content, thumbnail: thumbnailUrl, views: 0 }]);
      setMessage('Tạo bài viết mới thành công!');
      fetchPosts();
    } catch (error: any) {
      setMessage('Có lỗi khi lưu bài viết: ' + (error.message || ''));
    }
    setLoading(false);
    setShowAddModal(false);
  };

  // Sửa bài viết
  const handleEdit = (post: any) => {
    setEditingPostId(post.id);
    setEditData(post);
    setShowEditModal(true);
    setMessage(null);
  };

  // Cập nhật bài viết
  const handleUpdatePost = async ({ title, content, thumbnail, thumbnailFile }: any) => {
    setLoading(true);
    let thumbnailUrl = thumbnail;
    try {
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, thumbnailFile);
        if (!error) {
          const { data: urlData } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(fileName);
          thumbnailUrl = urlData.publicUrl;
        }
      }
      await supabase
        .from('posts')
        .update({ title, content, thumbnail: thumbnailUrl, updated_at: new Date().toISOString() })
        .eq('id', editingPostId);
      setMessage('Cập nhật bài viết thành công!');
      fetchPosts();
    } catch (error: any) {
      setMessage('Có lỗi khi cập nhật: ' + (error.message || ''));
    }
    setLoading(false);
    setEditingPostId(null);
    setEditData(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
      setLoading(true);
      try {
        await supabase.from('posts').delete().eq('id', id);
        setMessage('Xóa bài viết thành công!');
        fetchPosts();
      } catch (error) {
        setMessage('Có lỗi khi xóa bài viết!');
      }
      setLoading(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setMessage(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingPostId(null);
    setEditData(null);
    setMessage(null);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setMessage(null);
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Admin Panel - TByteNews</title>
      </Head>
      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <h1>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className={styles.submitButton}
              onClick={() => setShowAddModal(true)}
            >
              ✍️ Tạo bài viết mới
            </button>
            <button
              className={styles.submitButton}
              style={{ background: '#ff9800', color: '#fff' }}
              onClick={() => setShowProfileModal(true)}
            >
              👤 Thay đổi thông tin admin
            </button>
            <button
              className={styles.signOutButton}
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace('/admin/login');
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <h3>Tổng bài viết</h3>
            <p>{posts.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Tổng lượt xem</h3>
            <p>{totalViews}</p>
          </div>
        </div>
        {/* Modal thêm bài viết */}
        <AddPostModal
          visible={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddPost}
          loading={loading}
        />
        {/* Modal sửa bài viết */}
        <EditPostModal
          visible={showEditModal}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdatePost}
          loading={loading}
          editData={editData}
        />
        {/* Modal chỉnh sửa thông tin admin */}
        <AdminProfileModal
          visible={showProfileModal}
          onClose={handleCloseProfileModal}
        />
        {/* Thông báo */}
        {message && (
          <p className={styles.errorMessage} style={{ background: message.includes('thành công') ? '#e8f5e9' : undefined, color: message.includes('thành công') ? '#388e3c' : undefined }}>
            {message}
          </p>
        )}
        {/* Danh sách bài viết dạng block đẹp mắt */}
        <div className={styles.postsList}>
          <h2 style={{ marginBottom: 18 }}>Danh sách bài viết</h2>
          {loading ? (
            <LoadingSpinner />
          ) : posts.length > 0 ? (
            <div className={styles.postsGridAdmin}>
              {posts.map((post) => (
                <div key={post.id} className={styles.postBlock}>
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className={styles.postThumbnail}
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x80";
                      }}
                    />
                  )}
                  <div className={styles.postInfo}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postSummary}>
                      {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                    </p>
                    <div className={styles.postMeta}>
                      <span>👁️ {post.views || 0} lượt xem</span>
                      <span>🗓️ {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles.postActions}>
                    <button
                      onClick={() => handleEdit(post)}
                      className={styles.editButton}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className={styles.deleteButton}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPage;