import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ososo Alphabet and Pronunciation",
  description:
    "Explore the Ososo alphabet, letters, vowel marks, and a sample text introducing the Ososo writing system and pronunciation.",
};

const alphabet = [
  "A","À","Á","B","Bh","D","Dh","E","Ẹ","Ẹ̀","Ẹ́",
  "F","G","Gb","Gh","H","I","Ì","Í","K","Kh","L","M",
  "Mh","N","O","Ò","Ó","Ọ","Ọ̀","Ọ́","P","R","S","Sh",
  "T","U","Ù","Ú","V","W","Y","Z"
];

const sampleText = `ítéré Ósósọ̀, òkéké nó dì vbì ẹ́vbórí ítéré á sázú Ẹ́doid. ó mà máá yání àbí á dhí ví ọ́nì vbí èkhẹ̀ néné. Íkégbọ́ á dólí óbè, wá khì da yá ví ítéré Ósósọ̀ vbí èkhẹ̀, à mínẹ́ khí wì lí ìvìvbèkhè óyí Yorùbá, Ẹ̀dó ímàvbì óyí íkégbó áfọ̀, ònì wá tọ́ ví ítéré Ósósọ̀ vbí èkhẹ̀. A kpárògí ìmhè ónà vbí óní àkànyà ónà. Ànì mínẹ̀ khí, á khì dà yẹ́ á khí lò ìvìvbèkhè óyí Yorùbá, Ẹ̀dó ímàvbì óyí óbhò, ẹ́dẹ́vbàkhọ̀ kẹ, ítéré Ósósọ̀ tààrà í né fua. Áwí íbíá Ósósọ̀ á máà ró sé àfẹ̀ gwé àní íbíá á kpẹ́ vbí ékhẹ̀ sé nà pẹ̌, wà dhí nè ítéré Ósósọ̀ tààrà.`;

export default function AlphabetPage() {
  return (
    <main className="page-shell">
      <nav className="navbar container">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Image src="/oruku.jpg" alt="Oruku" width={46} height={46} priority />
          </span>
          <span>
            <strong>Ososo</strong>
            <small>Translator</small>
          </span>
        </Link>

        <div className="nav-links">
          <Link href="/">Translator</Link>
          <Link href="/dictionary">Dictionary</Link>
          <Link href="/alphabet" className="active">Alphabet</Link>
          <Link href="/about">About</Link>
          <Link href="/admin" className="admin-link">Admin</Link>
        </div>
      </nav>

      <section className="alphabet-page container">
        <div className="alphabet-hero">
          <div>
            <span className="eyebrow">OSOSO WRITING SYSTEM</span>
            <h1>
              Ososo <span>alphabet</span> & pronunciation.
            </h1>
            <p className="alphabet-lead">
              Explore the proposed Ososo orthography, its letters and the
              diacritics used to represent Ososo sounds in writing.
            </p>
          </div>

          <div className="alphabet-logo-card">
            <Image
              src="/oruku.jpg"
              alt="Oruku — Ososo Translator"
              width={640}
              height={480}
              priority
            />
          </div>
        </div>

        <section className="alphabet-section">
          <span className="eyebrow">THE ALPHABET</span>
          <h2>Ososo letters and forms</h2>

          <p className="alphabet-note">
            This reference follows the proposed 2024 orthography. Tone and
            vowel marks are preserved rather than flattened.
          </p>

          <div className="alphabet-card">
            <div className="alphabet-display">
              {alphabet.map((letter) => (
                <span className="alphabet-symbol" key={letter}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="alphabet-section">
          <span className="eyebrow">SAMPLE TEXT</span>
          <h2>Ososo in its own writing</h2>

          <div className="alphabet-card sample-text">
            {sampleText}
          </div>

          <div className="translation-panel">
            <strong>English translation</strong>
            <p className="alphabet-note">
              Ososo, a minor Edoid language, currently lacks a standardized
              writing system. When the need for literacy arises, literate
              Ososo indigenes often resort to an ad hoc mixture of Yoruba,
              Edo and English writing systems. The study investigates the
              phonological structure of Ososo alongside these orthographic
              systems and finds that they cannot adequately represent the
              Ososo sound system.
            </p>
          </div>

          <div className="source-links">
            <a href="https://www.omniglot.com/images/writing/ososo.gif" target="_blank" rel="noreferrer">
              Ososo alphabet chart
            </a>

            <a href="https://www.omniglot.com/charts/ososo.xlsx" target="_blank" rel="noreferrer">
              Download alphabet (Excel)
            </a>

            <a href="https://journalofwestafricanlanguages.org/downloads/download/148-volume-51-number-1/816-ososo-orthography-a-proposal" target="_blank" rel="noreferrer">
              2024 orthography proposal
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
