'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Видалити',
  cancelLabel = 'Скасувати',
  loading = false,
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const prev = document.activeElement as HTMLElement;
      setTimeout(() => confirmRef.current?.focus(), 50);
      return () => prev?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const btnClass = variant === 'danger' ? styles.btnDestructive : styles.btnPrimary;

  return createPortal(
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className={`${styles.modal} ${styles.confirmModal}`}>
        <div className={styles.modalBody} style={{ paddingBottom: 0 }}>
          <div className={styles.confirmIcon}>
            <AlertTriangle size={22} />
          </div>
          <h2 id="confirm-title" className={styles.modalTitle} style={{ marginBottom: '0.5rem' }}>
            {title}
          </h2>
          {message && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button
            ref={confirmRef}
            className={`${styles.btn} ${btnClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Видалення…' : confirmLabel}
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
