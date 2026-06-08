'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableCardProps {
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (open: boolean) => void;
}

export default function ExpandableCard({
  collapsedContent,
  expandedContent,
  defaultExpanded = false,
  onToggle,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [open, expandedContent]);

  function toggle() {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  return (
    <div
      style={{
        background: 'var(--admin-card-bg)',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          width: '100%', padding: '0.75rem 1rem',
          cursor: 'pointer', fontFamily: 'var(--admin-font)',
          color: 'var(--admin-text)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-secondary)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>
          {collapsedContent}
        </div>
        <ChevronDown
          size={16}
          strokeWidth={2}
          style={{
            flexShrink: 0,
            color: 'var(--admin-text-muted)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      <div
        style={{
          maxHeight: open ? `${contentHeight}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={contentRef} style={{ borderTop: open ? '1px solid var(--admin-border)' : 'none' }}>
          <div style={{ padding: '1rem' }}>
            {expandedContent}
          </div>
        </div>
      </div>
    </div>
  );
}
