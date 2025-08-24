import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';
import styles from '../../styles/admin.module.css';

const Admin = () => {
    const [posts, setPosts] = useState<{ id: string; title: string; content: string }[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('posts').select('*');
        if (error) console.error('Error fetching posts:', error);
        else setPosts(data || []);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingPostId) {
            await supabase.from('posts').update({ title, content }).eq('id', editingPostId);
        } else {
            await supabase.from('posts').insert([{ title, content }]);
        }
        setTitle('');
        setContent('');
        setEditingPostId(null);
        fetchPosts();
    };

    const handleEdit = (post: { id: string; title: string; content: string }) => {
        setTitle(post.title);
        setContent(post.content);
        setEditingPostId(post.id);
    };

    const handleDelete = async (id: string) => {
        await supabase.from('posts').delete().eq('id', id);
        fetchPosts();
    };

    return (
        <div className={styles.adminContainer}>
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post Title"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Post Content"
                    required
                />
                <button type="submit">{editingPostId ? 'Update Post' : 'Create Post'}</button>
            </form>
            <h2>Posts</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <button onClick={() => handleEdit(post)}>Edit</button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;