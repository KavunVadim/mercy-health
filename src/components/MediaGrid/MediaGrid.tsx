'use client';

import { useState } from 'react';
import styles from './MediaGrid.module.css';
import type { MediaItem } from '@/types/content';

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 8;

export default function MediaGrid({ items }: { items: MediaItem[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  function handleLoadMore() {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, items.length));
  }

  return (
    <div>
      <div className={styles.grid}>
        {visible.map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.image}
                loading="lazy"
              />
              {item.type === 'video' && (
                <div className={styles.playOverlay}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.body}>
              <span className={styles.source}>{item.source}</span>
              <h3 className={styles.title}>{item.title}</h3>
              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}
            </div>
            <div className={styles.footer}>
              <span className={styles.date}>{item.date}</span>
              <span className={styles.readLink}>
                {item.type === 'video' ? 'ДИВИТИСЬ' : 'ЧИТАТИ'}
              </span>
            </div>
          </a>
        ))}
      </div>

      {hasMore && (
        <div className={styles.center}>
          <button
            type="button"
            onClick={handleLoadMore}
            className={styles.loadMore}
          >
            ПОКАЗАТИ ЩЕ
          </button>
        </div>
      )}
    </div>
  );
}
