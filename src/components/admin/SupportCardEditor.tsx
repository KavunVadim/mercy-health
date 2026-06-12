'use client';

import { Plus, X } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import ExpandableCard from '@/components/admin/ui/ExpandableCard';
import ImageUploader from '@/components/admin/ImageUploader';

interface SupportCard {
  id: string;
  title: string;
  description: string;
  bank: string;
  link: string;
  image?: string;
}

interface SupportCardEditorProps {
  cards: SupportCard[];
  cardsEn: { id: string; title: string; description: string; bank: string; link: string; image?: string }[];
  onCardsChange: (cards: SupportCard[]) => void;
  onCardsEnChange: (cards: { id: string; title: string; description: string; bank: string; link: string; image?: string }[]) => void;
}

export default function SupportCardEditor({ cards, cardsEn, onCardsChange, onCardsEnChange }: SupportCardEditorProps) {
  function addCard() {
    const id = `card-${Date.now()}`;
    const image = '';
    onCardsChange([...cards, { id, title: '', description: '', bank: '', link: '', image }]);
    onCardsEnChange([...cardsEn, { id: `card-en-${Date.now()}`, title: '', description: '', bank: '', link: '', image }]);
  }

  function removeCard(i: number) {
    onCardsChange(cards.filter((_, idx) => idx !== i));
    onCardsEnChange(cardsEn.filter((_, idx) => idx !== i));
  }

  function updateCard(i: number, field: string, value: string) {
    const updated = [...cards];
    (updated[i] as any)[field] = value;
    onCardsChange(updated);
    const sharedFields = ['image', 'bank', 'link'];
    if (sharedFields.includes(field)) {
      const updatedEn = [...cardsEn];
      (updatedEn[i] as any)[field] = value;
      onCardsEnChange(updatedEn);
    }
  }

  function updateCardEn(i: number, field: string, value: string) {
    const updated = [...cardsEn];
    (updated[i] as any)[field] = value;
    onCardsEnChange(updated);
  }

  function collapsedView(card: SupportCard, i: number) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '8px',
          overflow: 'hidden', flexShrink: 0, background: 'var(--admin-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {card.image ? (
            <img src={card.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)' }}>
              {card.bank?.charAt(0) || '?'}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-text)' }}>
            {card.title || `Card ${i + 1}`}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            {card.bank || 'No bank set'}
          </div>
        </div>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); removeCard(i); }}
          className={`${styles.btn} ${styles.btnSm} ${styles.btnDestructive}`}
          style={{ flexShrink: 0 }}
          title="Remove card"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  function expandedView(card: SupportCard, i: number) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ImageUploader
          value={card.image || ''}
          onChange={val => updateCard(i, 'image', val)}
          label="Card Image (bank logo)"
        />
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title (UK)</label>
            <input
              className={styles.input}
              value={card.title}
              onChange={e => updateCard(i, 'title', e.target.value)}
              placeholder="Card title in Ukrainian"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title (EN)</label>
            <input
              className={styles.input}
              value={cardsEn[i]?.title || ''}
              onChange={e => updateCardEn(i, 'title', e.target.value)}
              placeholder="Card title in English"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Description (UK)</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={card.description}
              onChange={e => updateCard(i, 'description', e.target.value)}
              placeholder="Card description in Ukrainian"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Description (EN)</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={cardsEn[i]?.description || ''}
              onChange={e => updateCardEn(i, 'description', e.target.value)}
              placeholder="Card description in English"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bank</label>
            <input
              className={styles.input}
              value={card.bank}
              onChange={e => updateCard(i, 'bank', e.target.value)}
              placeholder="e.g. Monobank, PrivatBank"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Link</label>
            <input
              className={styles.input}
              value={card.link}
              onChange={e => updateCard(i, 'link', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button type="button" onClick={addCard} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>
          <Plus size={14} /> Add Card
        </button>
      </div>
      {cards.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          No donation cards yet. Click &quot;Add Card&quot; to create one.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cards.map((card, i) => (
            <ExpandableCard
              key={card.id}
              collapsedContent={collapsedView(card, i)}
              expandedContent={expandedView(card, i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
