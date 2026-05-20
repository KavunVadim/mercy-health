"use client";

import React, { useEffect, useState } from "react";
import LogoIcon from "../LogoIcon/LogoIcon";
import styles from "./Preloader.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [destroy, setDestroy] = useState(true);
  
  const params = useParams();
  const lang = params?.lang as string;
  const isUk = lang === "uk";

  useEffect(() => {
    setMounted(true);
    
    if (document.readyState !== "complete") {
      setVisible(true);
      setDestroy(false);

      const handleLoad = () => {
        setVisible(false);
      };

      window.addEventListener("load", handleLoad);
      
      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === "opacity" && !visible) {
      setDestroy(true);
    }
  };

  if (!mounted || destroy) return null;

  return (
    <div 
      className={clsx(styles.overlay, !visible && styles.fadeOut)}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <LogoIcon width={100} height={100} animate={visible} />
          {/* Ripple pulse waves */}
          <div className={styles.pulseRing} />
          <div className={clsx(styles.pulseRing, styles.ringDelayed)} />
        </div>
        
        <h2 className={styles.title}>
          {isUk ? (
            <>
              МИЛОСЕРДЯ <span className={styles.amp}>&</span> ЗДОРОВ'Я
            </>
          ) : (
            <>
              MERCY <span className={styles.amp}>&</span> HEALTH
            </>
          )}
        </h2>
        
        <div className={styles.loaderBar}>
          <div className={styles.progress} />
        </div>
      </div>
    </div>
  );
}
