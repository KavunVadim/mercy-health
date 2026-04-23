"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "./Partners.module.css";
import Image from "next/image";

export default function Partners({ dictionary }: { dictionary: any }) {
  const dict = dictionary as any;
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Expanded mock partners data for continuous scrolling
  const partners = [
    { id: 1, name: "Partner 1", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80" },
    { id: 2, name: "Partner 2", logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=100&fit=crop&q=80" },
    { id: 3, name: "Partner 3", logo: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=100&fit=crop&q=80" },
    { id: 4, name: "Partner 4", logo: "https://images.unsplash.com/photo-1614850523598-811484ff27bb?w=200&h=100&fit=crop&q=80" },
    { id: 5, name: "Partner 5", logo: "https://images.unsplash.com/photo-1614850523020-c05b28ce30f8?w=200&h=100&fit=crop&q=80" },
    { id: 6, name: "Partner 6", logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=100&fit=crop&q=80" },
    { id: 7, name: "Partner 7", logo: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=100&fit=crop&q=80" },
    { id: 8, name: "Partner 8", logo: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=100&fit=crop&q=80" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{dict.about.tabs.partners}</h2>
      <p className={styles.description}>
        Разом ми здатні на більше. Дякуємо нашим партнерам за постійну підтримку.
      </p>

      <div className={styles.sliderWrap} ref={emblaRef}>
        <div className={styles.sliderContainer}>
          {/* Double the items to ensure smooth infinite loop */}
          {[...partners, ...partners].map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className={styles.slide}>
              <div className={styles.logoCard}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={80}
                  className={styles.logoImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
