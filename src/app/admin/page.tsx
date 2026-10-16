"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ADMIN_ID = "eaab5a3a-e373-488e-bc13-c87d948700a5";

type Word = {
  id: string;
  word: string;
  meaning: string;
  part_of_speech: string | null;
  category: string | null;
  example_ososo: string | null;
  example_english: string | null;
  pronunciation: string | null;
  audio_url: string | null;
  status: string;
};

type WordForm = {
  word: string;
  meaning: string;
  part_of_speech: string;
  category: string;
  example_ososo: string;
  example_english: string;
  pronunciation: string;
  audio_url: string;
  status: string;
};

const emptyForm: WordForm = {
  word: "",
  meaning: "",
  part_of_speech: "",
  category: "",
  example_ososo: "",
  example_english: "",
  pronunciation: "",
  audio_url: "",
  status: "published",
};

export default function AdminPage() {
  const [supabase] = useState(() => createClient());
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("williamkhoko@gmail.com");
  const [password, setPassword] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [form, setForm] = useState<WordForm>({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadWords = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("words")
      .select(
        "id, word, meaning, part_of_speech, category, example_ososo, example_english, pronunciation, audio_url, status"
      )
      .order("word");

    if (loadError) {
      setError(`Could not load dictionary entries: ${loadError.message}`);
      return;
    }

    setWords((data ?? []) as Word[]);
  }, [supabase]);

  const checkSession = useCallback(async () => {
    setChecking(true);
    setError("");

    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      setError(sessionError.message);
      setChecking(false);
      return;
    }

    const user = data.session?.user;

    if (user?.id === ADMIN_ID) {
      setUserEmail(user.email ?? "");
      await loadWords();
    } else {
      setUserEmail("");
    }

    setChecking(false);
  }, [supabase, loadWords]);

  useEffect(() => {
    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        void checkSession();
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [supabase, checkSession]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);

    if (signInError) {
      setError(`Sign-in failed: ${signInError.message}`);
      return;
    }

    if (data.user?.id !== ADMIN_ID) {
      await supabase.auth.signOut();
      setError("This account is not authorised to manage the dictionary.");
      return;
    }

    setPassword("");
    setUserEmail(data.user.email ?? "");
    await loadWords();
    setNotice("Signed in successfully.");
  }

  async function signOut() {
    setError("");
    setNotice("");

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    setUserEmail("");
    setWords([]);
    resetForm();
    setNotice("You have signed out.");
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  function updateField(
    field: keyof WordForm,
    value: string
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editWord(item: Word) {
    setEditingId(item.id);
    setForm({
      word: item.word ?? "",
      meaning: item.meaning ?? "",
      part_of_speech: item.part_of_speech ?? "",
      category: item.category ?? "",
      example_ososo: item.example_ososo ?? "",
      example_english: item.example_english ?? "",
      pronunciation: item.pronunciation ?? "",
      audio_url: item.audio_url ?? "",
      status: item.status ?? "draft",
    });

    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveWord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const payload = {
      word: form.word.trim(),
      meaning: form.meaning.trim(),
      part_of_speech: form.part_of_speech || null,
      category: form.category || null,
      example_ososo: form.example_ososo.trim() || null,
      example_english: form.example_english.trim() || null,
      pronunciation: form.pronunciation.trim() || null,
      audio_url: form.audio_url.trim() || null,
      status: form.status,
    };

    const result = editingId
      ? await supabase
          .from("words")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("words").insert(payload);

    setBusy(false);

    if (result.error) {
      setError(
        `Could not ${editingId ? "update" : "add"} the word: ${result.error.message}`
      );
      return;
    }

    setNotice(
      editingId
        ? "Dictionary entry updated successfully."
        : "Word added successfully."
    );

    resetForm();
    await loadWords();
  }

  async function deleteWord(item: Word) {
    const confirmed = window.confirm(
      `Delete "${item.word}" permanently? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");

    const { error: deleteError } = await supabase
      .from("words")
      .delete()
      .eq("id", item.id);

    setBusy(false);

    if (deleteError) {
      setError(`Could not delete the word: ${deleteError.message}`);
      return;
    }

    if (editingId === item.id) resetForm();

    setNotice(`"${item.word}" was deleted.`);
    await loadWords();
  }

  const filteredWords = words.filter((item) =>
    `${item.word} ${item.meaning} ${item.category ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="page-shell">
      <nav className="navbar container">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Image
              src="/oruku.jpg"
              alt="Oruku"
              width={46}
              height={46}
              priority
            />
          </span>
          <span>
            <strong>Ososo</strong>
            <small>Translator</small>
          </span>
        </Link>

        <div className="nav-links">
          <Link href="/">Translator</Link>
          <Link href="/dictionary">Dictionary</Link>
          <Link href="/alphabet">Alphabet</Link>
          <Link href="/about">About</Link>
          <Link href="/admin" className="active admin-link">
            Admin
          </Link>
        </div>
      </nav>

      <section className="admin-page container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">DICTIONARY MANAGEMENT</span>
            <h1>Admin dashboard</h1>
            <p>
              Manage Ososo vocabulary in your existing dictionary.
            </p>
          </div>

          <Link href="/dictionary" className="secondary-button">
            View public dictionary
          </Link>
        </div>

        {checking ? (
          <p>Checking administrator session...</p>
        ) : !userEmail ? (
          <section className="admin-form">
            <h2>Administrator sign-in</h2>
            <p>Sign in with your authorised Supabase account.</p>

            <form onSubmit={signIn}>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              {error && (
                <p role="alert" className="admin-feedback admin-error">
                  {error}
                </p>
              )}

              {notice && (
                <p role="status" className="admin-feedback admin-success">
                  {notice}
                </p>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={busy}
              >
                {busy ? "Signing in..." : "Sign in →"}
              </button>
            </form>
          </section>
        ) : (
          <>
            <div className="admin-session">
              <span>
                Signed in as <strong>{userEmail}</strong>
              </span>
              <button
                type="button"
                className="secondary-button"
                onClick={signOut}
                disabled={busy}
              >
                Sign out
              </button>
            </div>

            {error && (
              <p role="alert" className="admin-feedback admin-error">
                {error}
              </p>
            )}

            {notice && (
              <p role="status" className="admin-feedback admin-success">
                {notice}
              </p>
            )}

            <section className="admin-form">
              <h2>{editingId ? "Edit dictionary entry" : "Add a word"}</h2>
              <p>
                Complete the fields below. Set the status to Published when
                the entry is ready to appear in the public dictionary.
              </p>

              <form onSubmit={saveWord}>
                <div className="form-grid">
                  <label>
                    Ososo word or phrase
                    <input
                      required
                      maxLength={200}
                      value={form.word}
                      onChange={(event) =>
                        updateField("word", event.target.value)
                      }
                      placeholder="Enter Ososo word"
                    />
                  </label>

                  <label>
                    English meaning
                    <input
                      required
                      maxLength={500}
                      value={form.meaning}
                      onChange={(event) =>
                        updateField("meaning", event.target.value)
                      }
                      placeholder="Enter English meaning"
                    />
                  </label>

                  <label>
                    Part of speech
                    <select
                      value={form.part_of_speech}
                      onChange={(event) =>
                        updateField("part_of_speech", event.target.value)
                      }
                    >
                      <option value="">Select one</option>
                      <option value="Noun">Noun</option>
                      <option value="Verb">Verb</option>
                      <option value="Adjective">Adjective</option>
                      <option value="Adverb">Adverb</option>
                      <option value="Pronoun">Pronoun</option>
                      <option value="Expression">Expression</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Category
                    <input
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      placeholder="e.g. Greetings, Food, People"
                    />
                  </label>

                  <label>
                    Publication status
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>

                  <label>
                    Pronunciation guide
                    <input
                      value={form.pronunciation}
                      onChange={(event) =>
                        updateField("pronunciation", event.target.value)
                      }
                      placeholder="Optional pronunciation"
                    />
                  </label>

                  <label>
                    Audio URL
                    <input
                      type="url"
                      value={form.audio_url}
                      onChange={(event) =>
                        updateField("audio_url", event.target.value)
                      }
                      placeholder="Optional URL to an audio recording"
                    />
                  </label>
                </div>

                <label>
                  Example in Ososo
                  <textarea
                    value={form.example_ososo}
                    onChange={(event) =>
                      updateField("example_ososo", event.target.value)
                    }
                    placeholder="Enter an example sentence..."
                  />
                </label>

                <label>
                  English translation of example
                  <textarea
                    value={form.example_english}
                    onChange={(event) =>
                      updateField("example_english", event.target.value)
                    }
                    placeholder="Enter the English translation..."
                  />
                </label>

                <div className="admin-actions">
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={busy}
                  >
                    {busy
                      ? "Saving..."
                      : editingId
                        ? "Save changes"
                        : "Add word →"}
                  </button>

                  {editingId && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={resetForm}
                      disabled={busy}
                    >
                      Cancel editing
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-entries">
              <h2>Existing dictionary entries ({words.length})</h2>

              <label>
                Search entries
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search words or meanings..."
                />
              </label>

              {filteredWords.length === 0 ? (
                <p>No matching entries found.</p>
              ) : (
                filteredWords.map((item) => (
                  <article className="dictionary-item" key={item.id}>
                    <div>
                      <span className="category">
                        {item.category || "General"} · {item.status}
                      </span>
                      <h3>{item.word}</h3>
                      <p>{item.meaning}</p>
                    </div>

                    <div className="admin-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => editWord(item)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => void deleteWord(item)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
