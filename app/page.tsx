import Script from "next/script";

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <div className="brand">
          <span className="brand__name">sou31415</span>
          <span className="brand__role">Portfolio</span>
        </div>
        <nav className="site-nav" aria-label="主要ナビゲーション">
          <a href="#about">About</a>
          <a href="#works">Works</a>
          <a href="#skill">Skill</a>
        </nav>
      </header>

      <main className="site-main">
        <section id="about" className="panel" aria-labelledby="about-title">
          <div className="panel__inner">
            <h2 id="about-title" className="panel__title">
              About
            </h2>
            <p>Webバックエンドが好き。</p>
            <ul className="info-grid" aria-label="プロフィール情報">
              <li>
                <span className="info-grid__label">Place</span>
                <span className="info-grid__value">Tokyo, Fukuoka</span>
              </li>
              <li>
                <span className="info-grid__label">Tech</span>
                <span className="info-grid__value">Web-Back,Web-Front,UI/UX...</span>
              </li>
              <li>
                <span className="info-grid__label" />
                <span className="info-grid__value">Minimal, Calm, Glassmorphism</span>
              </li>
            </ul>
            <div className="about__social">
              <span className="info-grid__label">SNS</span>
              <div className="social-links" aria-label="SNSアカウント" data-social-list>
                <a
                  className="social-links__item"
                  href="https://www.linkedin.com/in/sotaro-furukawa-7b6050304"
                  aria-label="LinkedIn"
                  data-platform="LinkedIn"
                >
                  LinkedIn
                </a>
                <a
                  className="social-links__item"
                  href="https://www.facebook.com/furukawa.sotaro.5"
                  aria-label="Facebook"
                  data-platform="Facebook"
                >
                  Facebook
                </a>
              </div>
            </div>
            <div className="about__media">
              <span className="info-grid__label">Activity</span>
              <ul className="media-links" aria-label="活動が紹介された記事や動画">
                <li>
                  <a href="https://example.com/article" className="media-links__item">
                    活動が紹介された記事タイトル
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="media-links__item"
                  >
                    活動紹介のYouTube動画
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="works" className="panel" aria-labelledby="works-title">
          <div className="panel__inner">
            <h2 id="works-title" className="panel__title">
              Works
            </h2>
            <div className="works">
              <article className="card">
                <h3 className="card__title">Apple Japan</h3>
                <p className="card__desc">Sales Specialist - Fukuoka</p>
                <span className="card__meta">2024/06/01 - 2024/11/30</span>
              </article>
              <article className="card">
                <h3 className="card__title">LabBase</h3>
                <p className="card__desc">Corporate Engineer</p>
                <span className="card__meta">2023/10/17 - 2024/01/31</span>
              </article>
            </div>
          </div>
        </section>

        <section id="skill" className="panel" aria-labelledby="skill-title">
          <div className="panel__inner">
            <h2 id="skill-title" className="panel__title">
              Skill
            </h2>
            <ul className="skill-list">
              <li>
                <span>Actix-Web</span>
                <span className="skill-list__bar" aria-hidden="true">
                  <span style={{ width: "85%" }} />
                </span>
                <span className="sr-only">85%</span>
              </li>
              <li>
                <span>Rust</span>
                <span className="skill-list__bar" aria-hidden="true">
                  <span style={{ width: "70%" }} />
                </span>
                <span className="sr-only">70%</span>
              </li>
              <li>
                <span>TypeScript</span>
                <span className="skill-list__bar" aria-hidden="true">
                  <span style={{ width: "60%" }} />
                </span>
                <span className="sr-only">60%</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <small>2024 sou31415</small>
      </footer>

      <Script src="/assets/js/portfolio.js" strategy="afterInteractive" />
    </>
  );
}
