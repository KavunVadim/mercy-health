'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';
import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
  title: string;
  shareLabel: string;
}

export default function ShareButtons({ title, shareLabel }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + currentUrl)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.shareTitle}>{shareLabel}</h3>
      <div className={styles.iconsGrid}>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="Share on Facebook" style={{ backgroundColor: '#1877F2', color: '#FFFFFF' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="Share on X" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="Share on Telegram" style={{ backgroundColor: '#24A1DE', color: '#FFFFFF' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.89 8.22l-1.97 9.28c-.15.65-.53.81-1.08.5l-3-2.21-1.45 1.4c-.16.16-.29.3-.59.3l.21-3.09 5.63-5.08c.24-.21-.05-.33-.37-.11L9.31 13 6.32 12c-.65-.2-1.27-.45-.1-.9l11.63-4.48c.52-.19.99.13.84.92l-.8 3.7z"/>
          </svg>
        </a>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.iconBtn} aria-label="Share on WhatsApp" style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.948.517 2.039.887 3.144.887h.002c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm3.426 8.312c-.145.405-.851.758-1.155.808-.28.045-.633.074-1.713-.365-1.4-.569-2.327-1.987-2.397-2.08-.07-.092-.567-.751-.567-1.442s.359-1.03.486-1.162c.128-.132.282-.165.375-.165.093 0 .186.001.266.005.085.004.2-.032.313.242.113.275.387.942.422 1.01.035.069.058.148.012.241-.047.094-.07.153-.141.233-.07.081-.148.18-.211.242-.07.069-.143.144-.061.285.082.141.364.602.781 1.02.536.536.985.702 1.127.784.141.082.224.069.306-.025.083-.094.354-.412.448-.553.094-.141.189-.117.318-.069.13.047.819.386.96.456.141.069.235.103.269.162.035.059.035.344-.11.749zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.017 19.302c-1.296 0-2.56-.347-3.662-1.002l-3.921 1.029 1.047-3.823c-.719-1.248-1.099-2.671-1.097-4.129.004-4.515 3.676-8.185 8.193-8.185 2.188 0 4.246.853 5.792 2.401a8.136 8.136 0 0 1 2.401 5.79c-.004 4.515-3.677 8.185-8.192 8.185z"/>
          </svg>
        </a>
        <button onClick={copyToClipboard} className={styles.iconBtn} aria-label="Copy link">
          {copied ? <Check size={28} color="#0066CC" /> : <LinkIcon size={28} />}
        </button>
      </div>
    </div>
  );
}
