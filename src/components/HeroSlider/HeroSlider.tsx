"use client";

import React, { useCallback, useLayoutEffect, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./HeroSlider.module.css";
import { clsx } from "clsx";

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
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: true, stopOnMouseEnter: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0);
  }, [emblaApi]);

  useLayoutEffect(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [selectedIndex]);

  const total = slides?.length ?? 0;
  const currentSlide = slides?.[selectedIndex];

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

      {/* Content layer — outside embla container so it doesn't scroll */}
      <div className={`container ${styles.contentLayer}`}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ height: `${progress}%` }} />
        </div>

        <div className={styles.inner}>
          {/* Badge / Source */}
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{currentSlide?.badge}</span>
          </div>

          {/* Title */}
          <h2 className={styles.title}>
            {currentSlide?.title}
          </h2>

          {/* Description */}
          <p className={styles.description}>{currentSlide?.description}</p>

          {/* CTA */}
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

        {/* Bottom controls */}
        <div className={styles.controls}>
          {/* Dots */}
          <div className={styles.dots}>
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={clsx(styles.dot, index === selectedIndex && styles.dotActive)}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Arrows */}
        <div className={styles.arrows}>
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
    </section>
  );
}
