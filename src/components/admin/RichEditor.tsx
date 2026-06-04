'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  height?: number;
}

export default function RichEditor({ value, onChange, label, height = 300 }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolBtn = ({ action, active, label: btnLabel }: { action: () => void; active: boolean; label: string }) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); action(); }}
      style={{
        padding: '0.35rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer',
        background: active ? '#3b82f6' : 'white', color: active ? 'white' : '#475569',
        fontWeight: 600, fontSize: '0.8rem', minWidth: '34px',
      }}
      title={btnLabel}
    >
      {btnLabel}
    </button>
  );

  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <ToolBtn action={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="B" />
          <ToolBtn action={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="I" />
          <ToolBtn action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="H2" />
          <ToolBtn action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} label="H3" />
          <ToolBtn action={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="•" />
          <ToolBtn action={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="1." />
        </div>
        <div style={{ padding: '0.75rem', minHeight: `${height}px`, cursor: 'text', fontSize: '0.95rem', lineHeight: 1.6 }} onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
