"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useState } from "react";

type NavSection = {
  id: string;
  label: string;
};

type Work = {
  title: string;
  description: string;
  period: string;
};

type Skill = {
  name: string;
  level: number;
};

type LinkItem = {
  label: string;
  href: string;
};

type NavItem =
  | (NavSection & { href: string; type: "section" })
  | { label: string; href: string; type: "link" };

const NAV_SECTIONS: NavSection[] = [
  { id: "about", label: "About" },
  { id: "works", label: "Works" },
  { id: "skill", label: "Skill" }
];

const NAV_ITEMS: NavItem[] = [
  ...NAV_SECTIONS.map((section) => ({
    ...section,
    href: `#${section.id}`,
    type: "section" as const
  })),
  { label: "Blog", href: "/blog", type: "link" as const }
];

const WORKS: Work[] = [
  {
    title: "Apple Japan",
    description: "Sales Specialist - Fukuoka",
    period: "2024/06/01 - 2024/11/30"
  },
  {
    title: "LabBase",
    description: "Corporate Engineer",
    period: "2023/10/17 - 2024/01/31"
  }
];

const SKILLS: Skill[] = [
  { name: "Actix-Web", level: 85 },
  { name: "Rust", level: 70 },
  { name: "TypeScript", level: 60 }
];

const SOCIAL_LINKS: LinkItem[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sotaro-furukawa-7b6050304"
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/furukawa.sotaro.5"
  }
];

const ACTIVITY_LINKS: LinkItem[] = [
  {
    label: "第34回高専プログラミングコンテスト課題部門 プレゼンテーション",
    href: "https://www.youtube.com/live/ro57pRwFhLM?si=cXeXDmQhOH04R8fW"
  },
  {
    label:"↑本校記事",
    href:"https://www.ariake-nct.ac.jp/award-info/2023/11/23670.html"
  },
  {
    label: "令和5年度 起業家甲子園 プレゼンテーション",
    href: "https://youtu.be/Dxvy-6MJinc?si=As8rUoCkjkEUD70B"
  },
  {
    label: "↑本校記事",
    href: "https://www.ariake-nct.ac.jp/award-info/2024/06/25756.html"
  }
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>(NAV_SECTIONS[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const observedSections = NAV_SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!("IntersectionObserver" in window) || observedSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              setActiveSection(id);
            }
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0.1
      }
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      if (typeof window === "undefined") {
        return;
      }

      const targetSection = document.getElementById(id);
      if (!targetSection) {
        return;
      }

      const prefersReducedMotion = window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      if (prefersReducedMotion) {
        return;
      }

      event.preventDefault();

      const header = document.querySelector<HTMLElement>("[data-site-header]");
      const headerOffset = header?.offsetHeight ?? 0;
      const top =
        targetSection.getBoundingClientRect().top + window.scrollY - headerOffset - 16;

      window.scrollTo({
        top,
        behavior: "smooth"
      });
    },
    []
  );

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-[#f4f6fb] px-4 py-8 sm:py-12">
      <header
        data-site-header
        className="sticky top-4 z-10 w-full max-w-4xl rounded-[18px] border border-[#dfe3eb] bg-white/90 px-6 py-5 shadow-2xl shadow-slate-400/20 backdrop-blur-md transition-colors sm:px-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-sm uppercase tracking-[0.08em] text-slate-500">
            <span className="text-base font-semibold text-slate-900">sou31415(ただいま改修工事中)</span>
            <span>Portfolio</span>
          </div>
          <nav
            aria-label="主要ナビゲーション"
            className="flex flex-wrap gap-3 text-sm font-medium text-slate-500"
          >
            {NAV_ITEMS.map((item) => {
              const baseClassName =
                "relative rounded-full px-4 py-2 transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#3f8efc] after:transition-transform after:content-[''] hover:text-slate-900 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f8efc]";

              if (item.type === "section") {
                const isActive = activeSection === item.id;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(event) => handleNavClick(event, item.id)}
                    className={`${baseClassName} ${
                      isActive ? "bg-[#e7efff] text-slate-900 after:scale-x-100" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link key={item.label} href={item.href} className={baseClassName}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-8 sm:space-y-10">
        <section
          id="about"
          className="rounded-[22px] border border-[#dfe3eb] bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur"
          aria-labelledby="about-title"
        >
          <div className="grid gap-6 p-6 sm:gap-7 sm:p-10">
            <h2
              id="about-title"
              className="relative inline-flex items-center gap-3 text-lg font-semibold tracking-[0.06em] text-slate-900 before:block before:h-0.5 before:w-8 before:rounded-full before:bg-[#3f8efc] before:content-['']"
            >
              About
            </h2>
            <p className="text-base text-slate-600">Webバックエンドが好き。</p>
            <ul className="grid gap-4 text-sm text-slate-600" aria-label="プロフィール情報">
              {[
                { label: "Place", value: "Tokyo, Fukuoka" },
                { label: "Tech", value: "Web-Back,Web-Front,UI/UX..." },
              ].map(({ label, value }) => (
                <li key={`${label}-${value}`} className="grid gap-1">
                  {label ? (
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {label}
                    </span>
                  ) : null}
                  <span className="text-base font-medium text-slate-900">{value}</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  SNS
                </span>
                <div
                  aria-label="SNSアカウント"
                  data-social-list
                  className="flex flex-wrap gap-3"
                >
                  {SOCIAL_LINKS.map(({ label, href }) => (
                    <a
                      key={href}
                      className="inline-flex items-center justify-center rounded-full border border-transparent bg-[#f0f3f9] px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:border-[#3f8efc] hover:bg-[#e7efff] hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f8efc]"
                      href={href}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  Activity
                </span>
                <ul className="grid gap-2 text-sm" aria-label="活動が紹介された記事や動画">
                  {ACTIVITY_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-[#f0f3f9] px-4 py-2 text-slate-500 transition-colors hover:border-[#3f8efc] hover:bg-[#e7efff] hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f8efc]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="works"
          className="rounded-[22px] border border-[#dfe3eb] bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur"
          aria-labelledby="works-title"
        >
          <div className="grid gap-6 p-6 sm:gap-7 sm:p-10">
            <h2
              id="works-title"
              className="relative inline-flex items-center gap-3 text-lg font-semibold tracking-[0.06em] text-slate-900 before:block before:h-0.5 before:w-8 before:rounded-full before:bg-[#3f8efc] before:content-['']"
            >
              Works
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {WORKS.map((work) => (
                <article
                  key={work.title}
                  className="grid gap-3 rounded-2xl border border-[#dfe3eb] bg-[#f0f3f9] p-5 transition-all hover:-translate-y-1 hover:border-[#3f8efc] hover:shadow-xl hover:shadow-[#3f8efc]/20 focus-within:-translate-y-1 focus-within:border-[#3f8efc] focus-within:shadow-xl focus-within:shadow-[#3f8efc]/20"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{work.title}</h3>
                  <p className="text-sm text-slate-500">{work.description}</p>
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                    {work.period}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="skill"
          className="rounded-[22px] border border-[#dfe3eb] bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur"
          aria-labelledby="skill-title"
        >
          <div className="grid gap-6 p-6 sm:gap-7 sm:p-10">
            <h2
              id="skill-title"
              className="relative inline-flex items-center gap-3 text-lg font-semibold tracking-[0.06em] text-slate-900 before:block before:h-0.5 before:w-8 before:rounded-full before:bg-[#3f8efc] before:content-['']"
            >
              Skill
            </h2>
            <ul className="grid gap-4" aria-label="スキルレベル">
              {SKILLS.map((skill) => (
                <li key={skill.name} className="grid gap-2">
                  <span className="text-base font-medium text-slate-900">{skill.name}</span>
                  <span className="sr-only">{skill.level}%</span>
                  <div className="relative h-2 overflow-hidden rounded-full bg-[#f0f3f9]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3f8efc] to-[#6bb3ff]"
                      style={{ width: `${skill.level}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="w-full max-w-4xl pb-6 text-center text-sm text-slate-500">
        <small>2024 sou31415</small>
      </footer>
    </div>
  );
}
