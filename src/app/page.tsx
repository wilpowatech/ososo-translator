"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Direction = "ososo-to-english" | "english-to-ososo";

type Word = {
  id: string;
  word: string;
  meaning: string;
};

// Make searches forgiving of missing tone marks and diacritics.
// Original Ososo spellings remain unchanged in the dictionary.
function normalizeForSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
}

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] =
    useState<Direction>("ososo-to-english");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [translationNote, setTranslationNote] = useState("");

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
    () => text.trim().toLocaleLowerCase().replace(/\s+/g, " "),
    [text]
  );

  const normalizedForSearch = useMemo(
    () => normalizeForSearch(text),
    [text]
  );

  const sourceLanguage =
    direction === "ososo-to-english" ? "Ososo" : "English";

  const targetLanguage =
    direction === "ososo-to-english" ? "English" : "Ososo";

  function translate() {
    if (!normalized) {
      setResult("");
      setTranslationNote("");
      return;
    }

    type Candidate = {
      tokens: string[];
      target: string;
    };

    const candidates: Candidate[] = [];

    for (const item of words) {
      const sourceTerms =
        direction === "ososo-to-english"
          ? [item.word]
          : item.meaning.split(/[;|/]/).map((part) => part.trim()).filter(Boolean);

      for (const term of sourceTerms) {
        const tokens =
          normalizeForSearch(term).match(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu) ?? [];

        if (tokens.length > 0) {
          candidates.push({
            tokens,
            target: direction === "ososo-to-english" ? item.meaning : item.word,
          });
        }
      }
    }

    // Longest dictionary phrases are checked before individual words.
    candidates.sort((a, b) => b.tokens.length - a.tokens.length);

    const inputTokens = Array.from(
      text.matchAll(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu)
    );

    const output: string[] = [];
    const unmatched: string[] = [];
    const stopWords = new Set([
      "a", "an", "the", "and", "or", "but", "to", "of", "in", "on",
      "at", "for", "from", "by", "with", "is", "are", "was", "were",
      "be", "been", "being", "he", "she", "it", "they", "we", "i",
      "you", "his", "her", "their", "our", "my", "your", "this",
      "that", "these", "those", "do", "does", "did", "not"
    ]);

    let cursor = 0;
    let index = 0;

    while (index < inputTokens.length) {
      const current = normalizeForSearch(inputTokens[index][0]);

      const match = candidates.find((candidate) =>
        candidate.tokens.every((part, offset) => {
          const inputToken = inputTokens[index + offset];
          return inputToken &&
            normalizeForSearch(inputToken[0]) === part;
        })
      );

      if (match) {
        const first = inputTokens[index];
        const last = inputTokens[index + match.tokens.length - 1];

        const startAt = first.index ?? 0;
        const endAt = (last.index ?? 0) + last[0].length;

        output.push(text.slice(cursor, startAt), match.target);
        cursor = endAt;
        index += match.tokens.length;
      } else {
        if (
          (direction === "ososo-to-english" || !stopWords.has(current)) &&
          !unmatched.some((item) => normalizeForSearch(item) === current)
        ) {
          unmatched.push(inputTokens[index][0]);
        }
        index += 1;
      }
    }

    output.push(text.slice(cursor));
    setResult(output.join("").trim() || text);

    const notes = [
      "Dictionary-based draft only — Ososo sentence grammar, word order and tense have not been validated."
    ];

    if (unmatched.length > 0) {
      notes.push(
        "Terms not found in the dictionary were left unchanged: " +
        unmatched.join(", ")
      );
    }

    setTranslationNote(notes.join(" "));
  }

  function swapLanguages() {
    setDirection((current) =>
      current === "ososo-to-english"
        ? "english-to-ososo"
        : "ososo-to-english"
    );

    setText("");
    setResult("");
    setTranslationNote("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main>
      <section className="hero">
        <nav className="navbar container">
          <Link href="/" className="brand">
            <span className="brand-mark"><Image src="/oruku.jpg" alt="Oruku" width={46} height={46} priority /></span>
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

            <Link href="/alphabet">Alphabet</Link>
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
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !loading &&
                      !loadError
                    ) {
                      e.preventDefault();
                      translate();
                    }
                  }}
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
                        setTranslationNote("");
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

                {translationNote && (
                  <p className="translation-note" role="status">
                    {translationNote}
                  </p>
                )}

                {result && (
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
