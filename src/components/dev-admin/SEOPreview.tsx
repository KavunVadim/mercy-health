'use client';

import React from 'react';
import styles from '@/styles/dev-admin.module.css';
import { GoogleLogo, FacebookLogo, TwitterLogo } from '@phosphor-icons/react';

interface SEOPreviewProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export const SEOPreview = ({ title, description, url = 'mercy-health.org/project/...', image }: SEOPreviewProps) => {
  return (
    <div className={styles.seoPreviewContainer}>
      <h3 className={styles.label} style={{ marginTop: 0 }}>SEO & Social Preview</h3>
      
      <div className={styles.seoTabs}>
        <div className={styles.seoTab}>
          <div className="flex items-center gap-2 mb-3 text-zinc-400 font-bold text-xs uppercase">
            <GoogleLogo size={16} /> Google Search
          </div>
          <div className={styles.googlePreview}>
            <div className={styles.googleUrl}>{url}</div>
            <div className={styles.googleTitle}>{title || 'Untitled Page'}</div>
            <div className={styles.googleDesc}>
              {description || 'Please provide a description to see how it will appear in search results...'}
            </div>
          </div>
        </div>

        <div className={styles.seoTab}>
          <div className="flex items-center gap-2 mb-3 text-zinc-400 font-bold text-xs uppercase">
            <FacebookLogo size={16} /> Facebook Share
          </div>
          <div className={styles.fbPreview}>
            {image && (
              <div className={styles.fbImage}>
                <img src={image} alt="Preview" />
              </div>
            )}
            <div className={styles.fbInfo}>
              <div className={styles.fbUrl}>mercy-health.org</div>
              <div className={styles.fbTitle}>{title || 'Untitled Page'}</div>
              <div className={styles.fbDesc}>{description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
