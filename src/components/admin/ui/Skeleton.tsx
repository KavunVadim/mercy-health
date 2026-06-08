import styles from '@/app/admin/admin.module.css';

interface SkeletonRowsProps {
  rows?: number;
  cols?: number;
}

export function SkeletonRows({ rows = 5, cols = 4 }: SkeletonRowsProps) {
  return (
    <div className={styles.card}>
      <table className={styles.table} style={{ width: '100%' }}>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} style={{ padding: '0.875rem 1rem' }}>
                  <div
                    className={styles.skeleton}
                    style={{
                      height: 14,
                      width: c === 0 ? 44 : c === cols - 1 ? 80 : `${55 + Math.random() * 30}%`,
                      borderRadius: c === 0 ? 8 : 4,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCards({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={`${styles.skeleton}`} style={{ width: 40, height: 40, borderRadius: 10 }} />
          <div className={styles.skeleton} style={{ height: 28, width: '40%', borderRadius: 4 }} />
          <div className={styles.skeleton} style={{ height: 12, width: '60%', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ height: 12, width: i === lines - 1 ? '60%' : '100%', borderRadius: 4 }}
        />
      ))}
    </div>
  );
}

export function SkeletonPhotoGrid({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.photoGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.skeleton}`} style={{ height: 160, borderRadius: 0 }} />
          <div style={{ padding: '0.75rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className={styles.skeleton} style={{ height: 12, width: '70%', borderRadius: 4 }} />
            <div className={styles.skeleton} style={{ height: 10, width: '45%', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
