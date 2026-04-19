import styles from "./page.module.css";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Image from "next/image";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{dictionary.about.title}</h1>
        </div>
      </header>

      <section className={`container ${styles.section}`}>
        <div className={styles.grid}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>{dictionary.about.history.title}</h2>
            <p className={styles.text}>{dictionary.about.history.content}</p>
          </div>
          <div className={styles.imageWrapper}>
            <Image 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000" 
              alt="Foundation history" 
              fill 
              className={styles.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className="container">
          <div className={styles.missionCard}>
            <h2 className={styles.missionTitle}>{dictionary.about.mission.title}</h2>
            <p className={styles.missionText}>{dictionary.about.mission.content}</p>
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={styles.teamTitle}>{dictionary.about.team.title}</h2>
        <div className={styles.teamGrid}>
          {dictionary.about.team.members.map((member: any, index: number) => (
            <div key={index} className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                {/* Placeholder for actual photos */}
                <span className={styles.avatarPlaceholder}>{member.name[0]}</span>
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
