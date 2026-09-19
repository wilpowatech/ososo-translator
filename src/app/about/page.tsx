import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <nav className="navbar container">
        <Link href="/" className="brand">
          <span className="brand-mark">O</span>
          <span>
            <strong>Ososo</strong>
            <small>Translator</small>
          </span>
        </Link>

        <div className="nav-links">
          <Link href="/">Translator</Link>
          <Link href="/dictionary">Dictionary</Link>
          <Link href="/about" className="active">About</Link>
          <Link href="/admin" className="admin-link">Admin</Link>
        </div>
      </nav>

      <section className="about-page container">
        <span className="eyebrow">OUR MISSION</span>
        <h1>Keeping Ososo language alive in the digital age.</h1>

        <p className="about-lead">
          Ososo Translator is a community-focused project created to document
          Ososo words and meanings and make them accessible through modern
          technology.
        </p>

        <div className="about-grid">
          <article>
            <span>01</span>
            <h2>Document</h2>
            <p>
              Build a reliable digital dictionary containing words, meanings,
              examples and pronunciation information.
            </p>
          </article>

          <article>
            <span>02</span>
            <h2>Preserve</h2>
            <p>
              Create a resource that can help younger generations learn and
              stay connected to the language.
            </p>
          </article>

          <article>
            <span>03</span>
            <h2>Connect</h2>
            <p>
              Make it easier for Ososo speakers and learners around the world
              to access the language.
            </p>
          </article>
        </div>

        <div className="about-callout">
          <h2>Help build the dictionary.</h2>
          <p>
            The quality of this project depends on accurate language
            contributions from people who know Ososo.
          </p>
          <Link href="/admin" className="primary-small">
            Add a word →
          </Link>
        </div>
      </section>
    </main>
  );
}
