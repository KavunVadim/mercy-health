'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  Images,
  LogOut,
  Users,
  FileText,
  Settings,
  SlidersHorizontal,
  FileEdit,
  ChevronLeft,
  Menu,
  X,
  Plus,
  Heart,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import styles from '@/app/admin/admin.module.css';
import AuthCheck from './AuthCheck';
import { ToastProvider } from '@/components/admin/ui/Toast';

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/news', label: 'News', icon: Newspaper },
      { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
      { href: '/admin/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'Media',
    items: [
      { href: '/admin/photos', label: 'Photos', icon: Images },
      { href: '/admin/hero-slider', label: 'Hero Slider', icon: SlidersHorizontal },
    ],
  },
  {
    label: 'Site',
    items: [
      { href: '/admin/partners', label: 'Partners', icon: Users },
      { href: '/admin/content', label: 'Content', icon: FileEdit },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (!mounted) return null;

  const sidebarClassNames = [
    styles.adminSidebar,
    collapsed ? styles.collapsed : '',
    mobileOpen ? styles.mobileOpen : '',
  ].filter(Boolean).join(' ');

  // Mobile backdrop via portal
  const backdrop = mobileOpen && mounted
    ? createPortal(
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setMobileOpen(false)}
        />,
        document.body
      )
    : null;

  return (
    <>
      <AuthCheck />
      <ToastProvider>
        <div className={styles.adminLayout}>
          {/* Mobile toggle */}
          <button
            className={styles.sidebarToggle}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {backdrop}

          {/* Sidebar */}
          <aside className={sidebarClassNames} aria-label="Admin navigation">
            {/* Header */}
            <div className={styles.sidebarHeader}>
              <div className={styles.adminLogo}>
                <div className={styles.logoMark} aria-hidden="true">
                  <Heart size={16} strokeWidth={2.5} />
                </div>
                <span className={styles.logoText}>Mercy Admin</span>
              </div>
              <button
                className={styles.collapseBtn}
                onClick={() => setCollapsed(c => !c)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={collapsed ? 'Expand' : 'Collapse'}
                style={{ display: 'none' }} // hidden on mobile, shown on desktop via media query
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* Nav */}
            <nav className={styles.sidebarNav}>
              {navSections.map(section => (
                <div key={section.label}>
                  <div className={styles.navSectionLabel}>{section.label}</div>
                  {section.items.map(item => {
                    const active = isActive(item.href, (item as any).exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                        onClick={() => {
                          if (window.innerWidth < 768) setMobileOpen(false);
                        }}
                        aria-current={active ? 'page' : undefined}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon size={17} className={styles.navIcon} strokeWidth={active ? 2.5 : 2} />
                        <span className={styles.navLabel}>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className={styles.sidebarFooter}>
              <button
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.logoutLink}`}
                title={collapsed ? 'Logout' : undefined}
                style={{ width: '100%' }}
              >
                <LogOut size={17} className={styles.navIcon} strokeWidth={2} />
                <span className={styles.navLabel}>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className={styles.adminMain} id="admin-content">
            <div className={styles.pageContent}>
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </>
  );
}
