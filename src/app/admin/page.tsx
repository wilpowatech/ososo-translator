"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [submitted, setSubmitted] = useState(false);

  function submitWord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

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
          <Link href="/about">About</Link>
          <Link href="/admin" className="active admin-link">Admin</Link>
        </div>
      </nav>

      <section className="admin-page container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">DICTIONARY MANAGEMENT</span>
            <h1>Add a word</h1>
            <p>
              Add Ososo vocabulary to the dictionary. Database storage and
              authentication will be connected next.
            </p>
          </div>

          <Link href="/dictionary" className="secondary-button">
            View dictionary
          </Link>
        </div>

        <form className="admin-form" onSubmit={submitWord}>
          <div className="form-grid">
            <label>
              Ososo word or phrase
              <input
                required
                name="word"
                placeholder="Enter word or phrase"
              />
            </label>

            <label>
              English meaning
              <input
                required
                name="meaning"
                placeholder="Enter English meaning"
              />
            </label>

            <label>
              Part of speech
              <select name="part_of_speech" defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option>Noun</option>
                <option>Verb</option>
                <option>Adjective</option>
                <option>Adverb</option>
                <option>Expression</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Category
              <select name="category" defaultValue="">
                <option value="" disabled>
                  Select category
                </option>
                <option>Greeting</option>
                <option>Family</option>
                <option>Food</option>
                <option>Nature</option>
                <option>Daily life</option>
                <option>Culture</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label>
            Example in Ososo
            <textarea
              name="example_ososo"
              placeholder="Enter an example sentence..."
            />
          </label>

          <label>
            English translation of example
            <textarea
              name="example_english"
              placeholder="Enter the English translation..."
            />
          </label>

          <label>
            Pronunciation
            <input
              name="pronunciation"
              placeholder="Optional pronunciation guide"
            />
          </label>

          {submitted && (
            <div className="success-message">
              ✓ Word form submitted. Database connection will be added next.
            </div>
          )}

          <button className="primary-button" type="submit">
            Add word →
          </button>
        </form>
      </section>
    </main>
  );
}
