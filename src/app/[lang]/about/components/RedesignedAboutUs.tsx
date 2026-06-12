"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./RedesignedAboutUs.module.css";
import clsx from "clsx";
import { 
  ShieldCheck, 
  Users, 
  Heart, 
  PencilLine, 
  Plus, 
  Trash2, 
  LayoutDashboard,
  ArrowRight
} from "lucide-react";
import type { Dictionary } from "@/types/content";

interface RedesignedAboutUsProps {
  dictionary: Dictionary;
}

export default function RedesignedAboutUs({ dictionary }: RedesignedAboutUsProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState("who_we_are");

  const historyText = [
    "Основні напрями нашої діяльності охоплюють забезпечення медикаментами першої необхідності та медичним обладнанням, надання консультаційної та реабілітаційної допомоги, постачання продуктів харчування, засобів гігієни, одягу, а також транспорту спеціального призначення — зокрема автомобілів швидкої допомоги.",
    "Команда фонду має багаторічний досвід у закупівлі та логістиці медичного обладнання. З 24 лютого 2022 року фонд суттєво розширив масштаби роботи. Ми активно налагоджували зв'язки з потенційними партнерами, просували наші потреби в медіа — і це дало результат: вдалося залучити значну кількість міжнародних донорів та партнерів.",
    "Благодійний фонд «Милосердя та Здоров'я» — заснований у 2016 році з метою надання допомоги населенню, медичним та соціальним установам і організаціям будь-якої форми власності."
  ];

  const galleryImages = [
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/1ab6c82fcb63943f.webp", caption: "Доставка гуманітарної допомоги на передову" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/e59a9f52636d86e0.webp", caption: "Забезпечення водою деокупованих територій" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/d8a6a79d7184b3f9.JPG", caption: "Обладнання сучасних реанімобілів" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/8ceeb51d684fcd4d.JPG", caption: "Медична евакуація в польових умовах" },
    { url: "https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/d677557cfe4838b8.webp", caption: "Турбота про найменших: допомога дітям" }
  ];

  const sidebarLinks = [
    { id: "who_we_are", label: "Хто ми" },
    { id: "mission", label: "Місія та цінності" },
    { id: "media", label: "Медіа про нас" }
  ];

  return (
    <div className={styles.wrapper}>
      {/* Admin Toggle */}
      <div className={styles.adminControls}>
        <button 
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={clsx(styles.adminToggle, isAdminMode && styles.active)}
        >
          {isAdminMode ? <ShieldCheck size={18} /> : <LayoutDashboard size={18} />}
          <span>{isAdminMode ? "Вийти з режиму редагування" : "Режим адміна (Preview)"}</span>
        </button>
      </div>

      <div className={styles.container}>
        {/* Modern Sticky Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.stickyNav}>
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={clsx(styles.navItem, activeTab === link.id && styles.navActive)}
              >
                <span className={styles.navLabel}>{link.label}</span>
                {activeTab === link.id && (
                  <motion.div 
                    layoutId="activeNav" 
                    className={styles.navIndicator}
                  />
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.main}>
          <AnimatePresence mode="wait">
            {activeTab === "who_we_are" && (
              <motion.div
                key="who_we_are"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Section 1: Hero */}
                <section className={styles.heroSection}>
                  <div className={styles.heroGrid}>
                    <div className={styles.heroContent}>
                      <div className={styles.eyebrow}>
                        <span>Про фонд</span>
                        <div className={styles.dot} />
                      </div>
                      <h1 className={styles.heroTitle}>
                        ПРО НАШУ <span className={styles.accentText}>ІСТОРІЮ</span>
                      </h1>
                      <p className={styles.heroLead}>
                        {historyText[0]}
                      </p>
                      {isAdminMode && (
                        <div className={styles.editOverlay}>
                          <PencilLine size={16} />
                          <span>Редагувати заголовок та лід</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.heroImageWrapper}>
                      <Image 
                        src="https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/18fb78a2301bb8e0.webp"
                        alt="Допомога людям"
                        fill
                        className={styles.heroImage}
                        priority
                      />
                      {isAdminMode && (
                        <div className={styles.editOverlay}>
                          <PencilLine size={16} />
                          <span>Змінити Hero Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 2: Secondary Content (Patches) */}
                <section className={styles.honorSection}>
                  <div className={styles.honorGrid}>
                    <div className={styles.honorImageWrapper}>
                      <div className={styles.patchFrame}>
                        <Image 
                          src="https://bookshop-images-vadim-2026.s3.us-east-1.amazonaws.com/uploads/73306f706831d53f.jpeg"
                          alt="Стіна пошани"
                          fill
                          className={styles.patchImage}
                        />
                        <div className={styles.frameDecoration} />
                      </div>
                      <p className={styles.imageCaption}>Стіна подяк від наших захисників</p>
                      {isAdminMode && (
                        <div className={styles.editOverlay}>
                          <PencilLine size={16} />
                          <span>Редагувати Стіну Пошани</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.honorContent}>
                      <h2 className={styles.sectionTitle}>Шлях Милосердя</h2>
                      <div className={styles.historyColumns}>
                        <p className={styles.historyText}>{historyText[1]}</p>
                        <p className={styles.historyText}>{historyText[2]}</p>
                      </div>
                      {isAdminMode && (
                        <div className={styles.editOverlay}>
                          <PencilLine size={16} />
                          <span>Редагувати текст історії</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 3: Photo Gallery */}
                <section className={styles.gallerySection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>ФОТОГАРЕЯ ДІЯЛЬНОСТІ</h2>
                    <p className={styles.sectionSubtitle}>Кожен кадр — це реальна історія допомоги та надії</p>
                  </div>
                  
                  <div className={styles.galleryGrid}>
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className={clsx(styles.galleryItem, styles[`item${idx + 1}`])}>
                        <Image 
                          src={img.url}
                          alt={img.caption}
                          fill
                          className={styles.galleryImg}
                        />
                        <div className={styles.galleryOverlay}>
                          <p>{img.caption}</p>
                        </div>
                        {isAdminMode && (
                          <div className={styles.adminImageControls}>
                            <button className={styles.adminBtn}><PencilLine size={14} /></button>
                            <button className={styles.adminBtn}><Trash2 size={14} /></button>
                          </div>
                        )}
                      </div>
                    ))}
                    {isAdminMode && (
                      <div className={styles.addGalleryItem}>
                        <Plus size={32} />
                        <span>Додати фото</span>
                      </div>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === "mission" && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.missionContainer}
              >
                <div className={styles.missionGrid}>
                  <div className={styles.missionCard}>
                    <ShieldCheck className={styles.missionIcon} />
                    <h3>Наша Місія</h3>
                    <p>Комплексна підтримка захисників України та цивільного населення шляхом надання медичної допомоги, спецобладнання та гуманітарних вантажів.</p>
                  </div>
                  <div className={styles.missionCard}>
                    <Users className={styles.missionIcon} />
                    <h3>Наша Команда</h3>
                    <p>Професіонали своєї справи: лікарі, логісти та волонтери, об’єднані спільними цінностями та прагненням перемоги.</p>
                  </div>
                  <div className={styles.missionCard}>
                    <Heart className={styles.missionIcon} />
                    <h3>Наші Цінності</h3>
                    <p>Прозорість, відповідальність, оперативність та людяність у кожному рішенні та кожній дії.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "media" && (
              <motion.div
                key="media"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.mediaContainer}
              >
                <div className={styles.mediaPlaceholder}>
                  <p>Тут з’являться новини та публікації у медіа про нашу роботу.</p>
                  <button className={styles.outlineBtn}>
                    Переглянути всі матеріали <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
