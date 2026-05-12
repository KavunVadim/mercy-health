'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styles from '@/styles/dev-admin.module.css';
import { 
  TextB, 
  TextItalic, 
  ListBullets, 
  ListNumbers, 
  ArrowUUpLeft, 
  ArrowUUpRight,
  TextHOne,
  TextHTwo
} from '@phosphor-icons/react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={styles.tiptapContainer}>
      <div className={styles.tiptapToolbar}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styles.tiptapBtnActive : styles.tiptapBtn}
          title="Bold"
        >
          <TextB size={18} weight="bold" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styles.tiptapBtnActive : styles.tiptapBtn}
          title="Italic"
        >
          <TextItalic size={18} weight="bold" />
        </button>
        <div className={styles.tiptapDivider} />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? styles.tiptapBtnActive : styles.tiptapBtn}
          title="Heading 1"
        >
          <TextHOne size={18} weight="bold" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styles.tiptapBtnActive : styles.tiptapBtn}
          title="Heading 2"
        >
          <TextHTwo size={18} weight="bold" />
        </button>
        <div className={styles.tiptapDivider} />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? styles.tiptapBtnActive : styles.tiptapBtn}
          title="Bullet List"
        >
          <ListBullets size={18} weight="bold" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? styles.tiptapBtnActive : styles.tiptapBtn}
          title="Ordered List"
        >
          <ListNumbers size={18} weight="bold" />
        </button>
        <div className={styles.tiptapDivider} />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={styles.tiptapBtn}
          title="Undo"
        >
          <ArrowUUpLeft size={18} weight="bold" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={styles.tiptapBtn}
          title="Redo"
        >
          <ArrowUUpRight size={18} weight="bold" />
        </button>
      </div>
      <EditorContent editor={editor} className={styles.tiptapContent} />
    </div>
  );
};
