"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";
import clsx from "clsx";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label, className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button 
      className={clsx(styles.button, className)} 
      onClick={() => router.back()} 
      aria-label="Go back"
    >
      <div className={styles.iconWrapper}>
        <ArrowLeft size={20} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
