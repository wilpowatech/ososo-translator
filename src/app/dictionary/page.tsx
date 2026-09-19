"use client";

import { useState } from "react";
import Link from "next/link";

const words = [
  {
    word: "Hello",
    meaning: "Hello",
    category: "Greeting",
  },
  {
    word: "Good morning",
    meaning: "Good morning",
    category: "Greeting",
  },
  {
    word: "Thank you",
    meaning: "Thank you",
    category: "Expression",
  },
  {
    word: "Water",
    meaning: "Water",
    category: "Daily life",
  },
  {
    word: "Food",
    meaning: "Food",
    category: "Daily life",
  },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState("");

  const filteredWords = words.filter((item) =>
    `${item.word} ${item.meaning} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          <Link href="/dictionary" className="active">Dictionary</Link>
          <Link href="/about">About</Link>
          <Link href="/admin" className="admin-link">Admin</Link>
        </div>
      </nav>

      <section className="page-header container">
        <span className="eyebrow">OSOSO LANGUAGE</span>
        <h1>Dictionary</h1>
        <p>
          Explore the growing collection of Ososo words and their English
          meanings.
        </p>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search the dictionary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="dictionary-list container">
        <div className="dictionary-count">
          {filteredWords.length} {filteredWords.length === 1 ? "entry" : "entries"}
        </div>

        {filteredWords.map((item) => (
          <article className="dictionary-item" key={item.word}>
            <div>
              <span className="category">{item.category}</span>
              <h2>{item.word}</h2>
            </div>

            <div className="meaning">
              <span>English meaning</span>
              <strong>{item.meaning}</strong>
            </div>

            <button type="button" className="sound-button" aria-label="Play pronunciation">
              🔊
            </button>
          </article>
        ))}

        {filteredWords.length === 0 && (
          <div className="empty-state">
            <h2>No word found</h2>
            <p>
              This word may not have been added yet. You can help expand the
              dictionary.
            </p>
            <Link href="/admin" className="primary-small">
              Add a word
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
