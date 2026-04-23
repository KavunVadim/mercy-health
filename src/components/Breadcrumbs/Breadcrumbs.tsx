"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import styles from "./Breadcrumbs.module.css";
import { Locale } from "@/i18n-config";

interface BreadcrumbsProps {
  lang: Locale;
  dictionary: Record<string, unknown>;
  items?: { label: string; href?: string }[];
  className?: string;
}

export default function Breadcrumbs({ lang, dictionary, items, className }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // If items are provided, use them. Otherwise, try to infer from pathname.
  const breadcrumbItems = items || [];

  if (breadcrumbItems.length === 0) {
    const segments = pathname.split('/').filter(Boolean);
    // Remove the language segment if it matches the current lang
    const firstSegment = segments[0];
    const pathSegments = (firstSegment === lang) ? segments.slice(1) : segments;
    
    breadcrumbItems.push({ label: dictionary.navigation.home || "Home", href: `/${lang}` });

    let currentHref = `/${lang}`;
    pathSegments.forEach((segment, index) => {
      // Don't add double language segment if it's already there
      currentHref += (currentHref.endsWith('/') ? '' : '/') + segment;
      
      // Try to find a translation for this segment
      let label = segment;
      if (dictionary.navigation[segment]) {
        label = dictionary.navigation[segment];
      } else if (dictionary[segment] && typeof dictionary[segment].title === 'string') {
        label = dictionary[segment].title;
      } else {
        // Capitalize if no translation found
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      breadcrumbItems.push({ 
        label, 
        href: index === pathSegments.length - 1 ? undefined : currentHref 
      });
    });
  }

  return (
    <nav aria-label="Breadcrumb" className={`${styles.breadcrumbs} ${className || ""}`}>
      <ol className={styles.list}>
        {breadcrumbItems.map((item, index) => (
          <li key={index} className={styles.item}>
            {index > 0 && <ChevronRight className={styles.separator} size={14} />}
            {item.href ? (
              <Link href={item.href} className={styles.link}>
                {index === 0 ? (
                  <div className={styles.homeIconWrapper}>
                    <Home size={16} />
                  </div>
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
