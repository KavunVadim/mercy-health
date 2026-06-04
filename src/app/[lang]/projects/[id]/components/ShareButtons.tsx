"use client";

import { useMemo, useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import styles from "./ShareButtons.module.css";
import type { CustomProperties, Dictionary } from "@/types/content";

interface ShareButtonsProps {
  title: string;
  shareLabel?: string;
  dictionary?: Dictionary;
}

export default function ShareButtons({ shareLabel, dictionary }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window === "undefined" ? "" : window.location.href;

  const shareDict = dictionary?.share || {
    title: "Share",
    copy: "Copy link",
    copied: "Copied"
  };

  const shareLinks = useMemo(() => [
    {
      name: "Facebook",
      title: dictionary?.share?.facebook || "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: "Telegram",
      title: dictionary?.share?.telegram || "Telegram",
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`,
      color: "#229ED9",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.307.28-.59.28l.194-2.825 5.141-4.642c.223-.19-.048-.285-.348-.085L6.347 13l-2.733-.855c-.594-.185-.604-.594.124-.88l10.683-4.12c.494-.18.927.115.773.956z" />
        </svg>
      )
    },
    {
      name: "WhatsApp",
      title: dictionary?.share?.whatsapp || "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`,
      color: "#25D366",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    },
    {
      name: "X",
      title: dictionary?.share?.x || "X",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
      color: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
  ], [currentUrl, dictionary]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.shareWrapper}>
        <div className={styles.topRow}>
          <div className={styles.socialGrid}>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                style={{ "--hover-color": link.color } as CustomProperties}
                title={`${dictionary?.share?.share_on || "Share on"} ${link.title}`}
              >
                {link.icon}
              </a>
            ))}
          </div>
          
          <button 
            onClick={handleCopy}
            className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
            title={shareDict.copy}
          >
            {copied ? (
              <>
                <Check size={18} className={styles.checkIcon} />
                <span>{shareDict.copied}</span>
              </>
            ) : (
              <>
                <LinkIcon size={18} />
                <span>{shareDict.copy}</span>
              </>
            )}
          </button>
        </div>
        <div className={styles.labelRow}>
           <span className={styles.shareLabel}>{shareLabel || shareDict.title}</span>
        </div>
      </div>
    </div>
  );
}
