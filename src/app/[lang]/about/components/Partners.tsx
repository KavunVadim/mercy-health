"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "./Partners.module.css";
import type { Dictionary, Partner } from "@/types/content";

export default function Partners({ dictionary }: { dictionary: Dictionary }) {
  const dict = dictionary;
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const partners = dictionary.partners || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{dict.about.tabs.partners}</h2>
      <p className={styles.description}>
        {dict.about.partners_description}
      </p>

      <div className={styles.sliderWrap} ref={emblaRef}>
        <div className={styles.sliderContainer}>
          {/* Double the items to ensure smooth infinite loop */}
          {[...partners, ...partners].map((partner: Partner, idx: number) => (
            <div key={`${partner.id}-${idx}`} className={styles.slide}>
              <div className={styles.logoCard}>
                <img src={partner.logo} alt={partner.name} className={styles.logoImage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
