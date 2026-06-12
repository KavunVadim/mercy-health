"use client";

import React, { useCallback, useLayoutEffect, useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./HeroSlider.module.css";
import { clsx } from "clsx";
import { sanitizeHtml } from "@/lib/sanitize";

interface Slide {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
  focus?: string;
}

const AUTOPLAY_DELAY = 6000;

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 22 }, [
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useLayoutEffect(() => {
    if (!emblaApi) return;
    const frame = requestAnimationFrame(() => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    });
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => cancelAnimationFrame(frame);
  }, [emblaApi, onSelect]);

  const currentSlide = slides?.[selectedIndex];
  const innerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Fit title з підтримкою ResizeObserver
  useEffect(() => {
    const inner = innerRef.current;
    const title = titleRef.current;
    if (!inner || !title) return;

    const adjustFontSize = () => {
      title.style.removeProperty("font-size");
      requestAnimationFrame(() => {
        if (inner.scrollHeight > inner.clientHeight) {
          const ratio = inner.clientHeight / inner.scrollHeight;
          const currentSize = parseFloat(getComputedStyle(title).fontSize);
          const newSize = Math.max(Math.round(currentSize * ratio * 0.95), 16);
          title.style.fontSize = `${newSize}px`;
        }
      });
    };

    adjustFontSize();

    const resizeObserver = new ResizeObserver(() => {
      adjustFontSize();
    });
    
    resizeObserver.observe(inner);
    return () => resizeObserver.disconnect();
  }, [currentSlide]);

  // View Transitions API для плавної зміни контенту
  const handleSlideChange = (index: number) => {
    if (typeof document !== 'undefined' && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        scrollTo(index);
      });
    } else {
      scrollTo(index);
    }
  };

  return (
    <section className={styles.viewport} ref={emblaRef}>
      <div className={styles.container}>
        {slides?.map((slide, index) => (
          <div
            className={clsx(styles.slide, index === selectedIndex && styles.slideActive)}
            key={slide.id}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className={styles.bgImage}
              priority={index === 0}
              style={{ objectPosition: slide.focus || "center 25%" }}
            />
            <div className={styles.overlay} />
          </div>
        ))}
      </div>

      <div className={`container ${styles.contentLayer}`}>
        <div className={styles.inner} ref={innerRef}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{currentSlide?.badge}</span>
          </div>

          <div className={styles.innerMain}>
            <h2 ref={titleRef} className={styles.title}>
              {currentSlide?.title}
            </h2>
            <p 
              className={styles.description} 
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentSlide?.description || '') }} 
            />
          </div>
        </div>

        {/* Нова структурована нижня панель без магічних чисел */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomBarLeft}>
            <div className={styles.dots}>
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={clsx(styles.dot, index === selectedIndex && styles.dotActive)}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.bottomBarCenter}>
            {currentSlide?.href?.startsWith("http") ? (
              <a
                href={currentSlide.href}
                className={styles.cta}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{currentSlide.cta}</span>
                <ArrowUpRight size={18} strokeWidth={2} />
              </a>
            ) : (
              <Link href={currentSlide?.href || "#"} className={styles.cta}>
                <span>{currentSlide?.cta}</span>
                <ArrowRight size={18} strokeWidth={2} />
              </Link>
            )}
          </div>

          <div className={styles.bottomBarRight}>
            <button className={styles.arrow} onClick={scrollPrev} aria-label="Previous slide">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.arrow} onClick={scrollNext} aria-label="Next slide">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}