'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useEffect, useState, useCallback } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Link as LinkIcon, Undo2, Redo2 } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  height?: number;
}

export default function RichEditor({ value, onChange, label, height = 300 }: RichEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
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

  const handleLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    if (previousUrl) {
      setLinkUrl(previousUrl);
      setShowLinkInput(true);
    } else {
      setLinkUrl('');
      setShowLinkInput(true);
    }
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  if (!editor) return null;

  const ToolBtn = ({ action, active, label, title }: { action: () => void; active?: boolean; label: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); action(); }}
      title={title}
      className={`${styles.btn} ${styles.btnSm}`}
      style={{
        border: active ? '1px solid var(--admin-accent)' : '1px solid var(--admin-border)',
        background: active ? 'var(--admin-accent-light)' : 'transparent',
        color: active ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
        fontWeight: 600, fontSize: '0.8rem', minWidth: 32, padding: '0.3rem 0.45rem', minHeight: 30,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {label && <label className={styles.label}>{label}</label>}
      <div style={{ border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-lg)', overflow: 'hidden', background: 'var(--admin-surface)', marginTop: '0.35rem' }}>
        <div style={{ display: 'flex', gap: '0.2rem', padding: '0.4rem 0.5rem', background: 'var(--admin-secondary)', borderBottom: '1px solid var(--admin-border)', flexWrap: 'wrap', alignItems: 'center' }}>
          <ToolBtn action={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label={<Bold size={14} />} title="Bold" />
          <ToolBtn action={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label={<Italic size={14} />} title="Italic" />
          <ToolBtn action={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} label={<UnderlineIcon size={14} />} title="Underline" />
          <ToolBtn action={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} label={<Strikethrough size={14} />} title="Strikethrough" />
          <div style={{ width: 1, height: 20, background: 'var(--admin-border)', margin: '0 0.2rem' }} />
          <ToolBtn action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label={<Heading2 size={14} />} title="Heading 2" />
          <ToolBtn action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} label={<Heading3 size={14} />} title="Heading 3" />
          <div style={{ width: 1, height: 20, background: 'var(--admin-border)', margin: '0 0.2rem' }} />
          <ToolBtn action={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label={<List size={14} />} title="Bullet List" />
          <ToolBtn action={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label={<ListOrdered size={14} />} title="Ordered List" />
          <ToolBtn action={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} label={<Quote size={14} />} title="Blockquote" />
          <ToolBtn action={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} label={<Code size={14} />} title="Code Block" />
          <div style={{ width: 1, height: 20, background: 'var(--admin-border)', margin: '0 0.2rem' }} />
          <ToolBtn action={handleLink} active={editor.isActive('link')} label={<LinkIcon size={14} />} title="Insert Link" />
          <ToolBtn action={() => editor.chain().focus().setHorizontalRule().run()} active={false} label={<Minus size={14} />} title="Horizontal Rule" />
          <div style={{ width: 1, height: 20, background: 'var(--admin-border)', margin: '0 0.2rem' }} />
          <ToolBtn action={() => editor.chain().focus().undo().run()} active={false} label={<Undo2 size={14} />} title="Undo" />
          <ToolBtn action={() => editor.chain().focus().redo().run()} active={false} label={<Redo2 size={14} />} title="Redo" />
        </div>

        {showLinkInput && (
          <div style={{ display: 'flex', gap: '0.35rem', padding: '0.5rem', background: 'var(--admin-secondary)', borderBottom: '1px solid var(--admin-border)', alignItems: 'center' }}>
            <input
              className={styles.input}
              type="url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://..."
              style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.8rem', minHeight: 0 }}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } if (e.key === 'Escape') setShowLinkInput(false); }}
            />
            <button type="button" onClick={applyLink} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`} style={{ fontSize: '0.75rem', minHeight: 28, padding: '0.25rem 0.6rem' }}>Apply</button>
            <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); setLinkUrl(''); }} className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', minHeight: 28, padding: '0.25rem 0.6rem' }}>Remove</button>
          </div>
        )}

        <div style={{ padding: '1rem', minHeight: `${height}px`, cursor: 'text', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--admin-text)' }} onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
