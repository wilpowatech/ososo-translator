"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Direction = "ososo-to-english" | "english-to-ososo";

type Word = {
  id: string;
  word: string;
  meaning: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] =
    useState<Direction>("ososo-to-english");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadDictionary() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("words")
        .select("id, word, meaning")
        .eq("status", "published")
        .order("word");

      if (error) {
        console.error("Supabase error:", error);
        setLoadError(error.message);
      } else {
        setWords(data ?? []);
      }

      setLoading(false);
    }

    loadDictionary();
  }, []);

  const normalized = useMemo(
    () => text.trim().toLowerCase(),
    [text]
  );

  const sourceLanguage =
    direction === "ososo-to-english" ? "Ososo" : "English";

  const targetLanguage =
    direction === "ososo-to-english" ? "English" : "Ososo";

  function translate() {
    if (!normalized) {
      setResult("");
      return;
    }

    const match = words.find((item) => {
      if (direction === "ososo-to-english") {
        return item.word.trim().toLowerCase() === normalized;
      }

      return item.meaning.trim().toLowerCase() === normalized;
    });

    if (match) {
      setResult(
        direction === "ososo-to-english"
          ? match.meaning
          : match.word
      );
    } else {
      setResult(
        `This ${sourceLanguage.toLowerCase()} word or phrase is not in the dictionary yet. You can help us add it.`
      );
    }
  }

  function swapLanguages() {
    setDirection((current) =>
      current === "ososo-to-english"
        ? "english-to-ososo"
        : "ososo-to-english"
    );

    setText("");
    setResult("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  const isMissingTranslation =
    result.startsWith("This ") &&
    result.endsWith("add it.");

  return (
    <main>
      <section className="hero">
        <nav className="navbar container">
          <Link href="/" className="brand">
            <span className="brand-mark">O</span>
            <span>
              <strong>Ososo</strong>
              <small>Translator</small>
            </span>
          </Link>

          <div className="nav-links">
            <Link href="/" className="active">
              Translator
            </Link>

            <Link href="/dictionary">
              Dictionary
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/admin" className="admin-link">
              Admin
            </Link>
          </div>
        </nav>

        <div className="hero-content container">
          <div className="eyebrow">
            PRESERVING THE OSOSO LANGUAGE
          </div>

          <h1>
            Speak Ososo.
            <br />
            <span>Connect with the world.</span>
          </h1>

          <p className="hero-description">
            Translate words and phrases from Ososo to English
            while helping preserve and document our language for
            future generations.
          </p>

          <div className="translator-card">
            <div className="language-bar">
              <div className="language">
                <span className="language-dot" />
                <strong>{sourceLanguage}</strong>
              </div>

              <button
                className="swap-button"
                type="button"
                aria-label="Swap languages"
                title="Swap languages"
                onClick={swapLanguages}
              >
                ⇄
              </button>

              <div className="language">
                <span className="language-dot english" />
                <strong>{targetLanguage}</strong>
              </div>
            </div>

            <div className="translation-grid">
              <div className="translation-box">
                <label htmlFor="source-text">
                  {sourceLanguage.toUpperCase()}
                </label>

                <textarea
                  id="source-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    direction === "ososo-to-english"
                      ? "Enter an Ososo word or phrase..."
                      : "Enter an English word or phrase..."
                  }
                  maxLength={500}
                />

                <div className="box-footer">
                  <span>{text.length}/500</span>

                  {text && (
                    <button
                      type="button"
                      className="clear-button"
                      onClick={() => {
                        setText("");
                        setResult("");
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="translation-box result-box">
                <label>
                  {targetLanguage.toUpperCase()}
                </label>

                <div
                  className={`result ${
                    result ? "has-result" : ""
                  }`}
                >
                  {loading ? (
                    <span className="placeholder">
                      Loading dictionary...
                    </span>
                  ) : loadError ? (
                    <span className="placeholder">
                      Unable to load the dictionary.
                    </span>
                  ) : (
                    result || (
                      <span className="placeholder">
                        Your translation will appear here...
                      </span>
                    )
                  )}
                </div>

                {result && !isMissingTranslation && (
                  <button
                    type="button"
                    className="copy-button"
                    onClick={copyResult}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              className="translate-button"
              onClick={translate}
              disabled={loading || !!loadError}
            >
              Translate
              <span>→</span>
            </button>
          </div>

          <div className="help-row">
            <span>Can't find a word?</span>

            <Link href="/admin">
              Help us grow the dictionary →
            </Link>
          </div>
        </div>
      </section>

      <section className="features container">
        <div className="section-heading">
          <span className="eyebrow">
            MORE THAN A TRANSLATOR
          </span>

          <h2>Building a digital home for Ososo.</h2>

          <p>
            This project is being built to document, preserve
            and make the Ososo language easier to learn and
            share.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">Aa</div>

            <h3>Growing Dictionary</h3>

            <p>
              A curated collection of Ososo words, meanings,
              examples and pronunciation information.
            </p>

            <Link href="/dictionary">
              Explore dictionary →
            </Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon">◉</div>

            <h3>Language Preservation</h3>

            <p>
              Help create a lasting digital record of words and
              expressions that can be passed to future
              generations.
            </p>

            <Link href="/about">
              Learn more →
            </Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon">+</div>

            <h3>Community Contributions</h3>

            <p>
              Native speakers can help expand the dictionary
              with accurate meanings, examples and
              pronunciation.
            </p>

            <Link href="/admin">
              Add a word →
            </Link>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong>Ososo Translator</strong>

            <p>
              Preserving language. Connecting people.
            </p>
          </div>

          <div className="footer-links">
            <Link href="/dictionary">
              Dictionary
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/admin">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
