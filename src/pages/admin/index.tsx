import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';
import styles from '../../styles/admin.module.css';
import Head from 'next/head';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingPostId) {
        await supabase
          .from('posts')
          .update({ title, content, thumbnail })
          .eq('id', editingPostId);
        alert('Post updated successfully!');
      } else {
        await supabase
          .from('posts')
          .insert([{ title, content, thumbnail, views: 0 }]);
        alert('Post created successfully!');
      }

      setTitle('');
      setContent('');
      setThumbnail('');
      setEditingPostId(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('An error occurred while saving the post.');
    }
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setContent(post.content);
    setThumbnail(post.thumbnail || '');
    setEditingPostId(post.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await supabase.from('posts').delete().eq('id', id);
        alert('Post deleted successfully!');
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('An error occurred while deleting the post.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Admin Panel - TByteNews</title>
      </Head>
      <div className={styles.adminContainer}>
        <h1>Admin Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Thumbnail URL"
          />
          <button type="submit">
            {editingPostId ? 'Update Post' : 'Create Post'}
          </button>
        </form>
        <div>
          {posts.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPage;