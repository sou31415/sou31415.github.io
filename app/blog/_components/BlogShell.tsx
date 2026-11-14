import Link from "next/link";
import type { ReactNode } from "react";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="blog-site">
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <header className="site-header">
        <Link className="site-name" href="/" aria-label="sou31415 ブログのトップへ">
          sou31415<span className="site-name__suffix"> / blog</span>
        </Link>
        <nav aria-label="主要ナビゲーション">
          <Link className="text-link" href="/">記事一覧</Link>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <small>© sou31415</small>
        <span>sou31415.github.io</span>
      </footer>
    </div>
  );
}
