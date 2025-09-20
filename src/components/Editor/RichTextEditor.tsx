// ...existing code...
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import supabase from '../../utils/supabaseClient'; // ensure this exists and exports configured supabase client
// ...existing code...

// cast dynamic import to any so ref prop is allowed
const ReactQuill: any = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
  const quillRef = useRef<any>(null);

  const BUCKET = 'post-images'; // đổi tên bucket nếu bạn dùng khác

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // upload to server API which uses service_role to save to Supabase storage
      const fd = new FormData();
      fd.append('file', file);

      const resp = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await resp.json();
      const url = json.publicUrl;
      if (!url) return;

      const editor = quillRef.current?.getEditor();
      const range = editor?.getSelection?.(true);
      const index = (range && range.index) || editor?.getLength?.() || 0;
      editor?.insertEmbed(index, 'image', url);
      editor?.setSelection(index + 1);
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image',
  ];

  return (
    <div className={className}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={(content: string) => onChange(content)}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Viết nội dung ở đây...'}
        theme="snow"
      />
    </div>
  );
};

export default RichTextEditor;
// ...existing code...