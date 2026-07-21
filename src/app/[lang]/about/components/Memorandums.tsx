'use client';

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "./Memorandums.module.css";
import type { Dictionary, Partner } from "@/types/content";

export default function Memorandums({ dictionary }: { dictionary: Dictionary }) {
  const dict = dictionary;
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ speed: 1, direction: 'backward', stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const memorandums = dictionary.memorandums || [];

  if (memorandums.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{dict.about.memorandums_title}</h2>
      <p className={styles.description}>
        {dict.about.memorandums_description}
      </p>

      <div className={styles.sliderWrap} ref={emblaRef}>
        <div className={styles.sliderContainer}>
          {[...memorandums, ...memorandums].map((item: Partner, idx: number) => (
            <div key={`${item.id}-${idx}`} className={styles.slide}>
              <div className={styles.logoCard}>
                <img src={item.logo} alt={item.name} className={styles.logoImage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
