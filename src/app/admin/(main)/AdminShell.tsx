"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  Image,
  LogOut,
  Users,
  FileText,
  Settings,
  SlidersHorizontal,
  FileEdit,
} from "lucide-react";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/photos", label: "Photos", icon: Image },
  { href: "/admin/partners", label: "Partners", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/hero-slider", label: "Hero Slider", icon: SlidersHorizontal },
  { href: "/admin/content", label: "Content", icon: FileEdit },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

import AuthCheck from "./AuthCheck";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AuthCheck />
      <div className={styles.adminLayout}>
        <button
          className={styles.sidebarToggle}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <aside
          className={`${styles.adminSidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        >
          <div className={styles.sidebarHeader}>
            <h1 className={styles.adminLogo}>
              <span className={styles.logoIcon}>🛠️</span>
              <span className={styles.logoText}>Mercy Admin</span>
            </h1>
          </div>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  onClick={() => {
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
              className={`${styles.navLink} ${styles.logoutLink}`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className={styles.sidebarBackdrop}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className={styles.adminMain}>{children}</main>
      </div>
    </>
  );
}
