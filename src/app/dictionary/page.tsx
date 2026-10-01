"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Word = {
  id: number;
  word: string;
  meaning: string;
  category: string | null;
  pronunciation: string | null;
};

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWords() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("words")
        .select("id, word, meaning, category, pronunciation")
        .eq("status", "published")
        .order("word");

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
      } else {
        setWords(data ?? []);
      }

      setLoading(false);
    }

    loadWords();
  }, []);

  const filteredWords = words.filter((item) =>
    `${item.word} ${item.meaning} ${item.category ?? ""}`
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
          <Link href="/dictionary" className="active">
            Dictionary
          </Link>
          <Link href="/about">About</Link>
          <Link href="/admin" className="admin-link">
            Admin
          </Link>
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
        {loading && <div className="dictionary-count">Loading dictionary...</div>}

        {!loading && error && (
          <div className="empty-state">
            <h2>Unable to load dictionary</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="dictionary-count">
              {filteredWords.length}{" "}
              {filteredWords.length === 1 ? "entry" : "entries"}
            </div>

            {filteredWords.map((item) => (
              <article className="dictionary-item" key={item.id}>
                <div>
                  <span className="category">
                    {item.category || "General"}
                  </span>
                  <h2>{item.word}</h2>
                </div>

                <div className="meaning">
                  <span>English meaning</span>
                  <strong>{item.meaning}</strong>
                </div>

                <button
                  type="button"
                  className="sound-button"
                  aria-label={`Play pronunciation of ${item.word}`}
                >
                  🔊
                </button>
              </article>
            ))}

            {filteredWords.length === 0 && (
              <div className="empty-state">
                <h2>No word found</h2>
                <p>
                  This word may not have been added yet. You can help expand
                  the dictionary.
                </p>
                <Link href="/admin" className="primary-small">
                  Add a word
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
