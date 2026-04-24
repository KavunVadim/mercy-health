"use client";

import React, { useCallback, useLayoutEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }),
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className={styles.viewport} ref={emblaRef}>
      <div className={styles.container}>
        {slides.map((slide, index) => (
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
            />
            <div className={styles.overlay} />
            <div className={`container ${styles.content}`}>
              <div className={styles.inner}>
                <span className={styles.badge}>{slide.badge}</span>
                <h2 className={styles.title}>
                  <span className={styles.titleWrap}>{slide.title}</span>
                </h2>
                <p className={styles.description}>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={`container ${styles.controlsInner}`}>
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

          <div className={styles.controlsRight}>
            <div className={styles.staticActions}>
              {slides[selectedIndex]?.href.startsWith("http") ? (
                <a
                  href={slides[selectedIndex].href}
                  className={styles.cta}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {slides[selectedIndex].cta}
                </a>
              ) : (
                <Link href={slides[selectedIndex]?.href || "#"} className={styles.cta}>
                  {slides[selectedIndex]?.cta}
                </Link>
              )}
            </div>

            <div className={styles.arrows}>
              <button className={styles.arrow} onClick={scrollPrev} aria-label="Previous slide">
                <ChevronLeft size={24} />
              </button>
              <button className={styles.arrow} onClick={scrollNext} aria-label="Next slide">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
