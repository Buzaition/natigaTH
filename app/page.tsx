"use client";

import { FormEvent, useState } from "react";

type Student = { name?: string; total: number; status: string };
type StudentIndex = Record<string, [name: string, total: number, status: string]>;

const MAX_SCORE = 320;

function formatPercentage(value: number) {
  const scaled = Math.trunc(value * 10000);
  const whole = Math.trunc(scaled / 10000);
  const fraction = String(scaled % 10000).padStart(4, "0").replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : `${whole}`;
}

export default function Home() {
  const [seatNumber, setSeatNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Student | null>(null);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = seatNumber.replace(/\D/g, "");
    setSeatNumber(cleaned);

    if (!cleaned) {
      setResult(null);
      setSearched(true);
      return;
    }

    try {
      const response = await fetch(`/data/${cleaned.slice(0, 3)}.json`);
      const index: StudentIndex = response.ok ? await response.json() : {};
      const student = index[cleaned];
      setResult(student ? { name: student[0], total: student[1], status: student[2] } : null);
    } catch {
      setResult(null);
    }

    setSearched(true);
  }

  const percentage = result ? (result.total / MAX_SCORE) * 100 : 0;
  const displayedPercentage = formatPercentage(percentage);

  return (
    <main className="page-shell">
      <section className="result-card" aria-labelledby="page-title">
        <div className="top-mark">نتيجة الثانوية العامة</div>
        <h1 id="page-title">اعرف نتيجتك</h1>
        <p className="intro">ابحث باستخدام رقم الجلوس فقط</p>

        <form onSubmit={search} className="search-form">
          <label htmlFor="seat-number">رقم الجلوس</label>
          <div className="search-row">
            <input
              id="seat-number"
              value={seatNumber}
              onChange={(event) => setSeatNumber(event.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="أدخل رقم الجلوس"
              aria-describedby="number-help"
              required
            />
            <button type="submit">بحث</button>
          </div>
          <p id="number-help" className="hint">يقبل إدخال الأرقام فقط</p>
        </form>

        {searched && result && (
          <div className="result-panel" aria-live="polite">
            <p className="result-label">نتيجتك</p>
            {result.name && <p className="student-name">{result.name}</p>}
            <div className="score-line">
              <strong>{result.total}</strong>
              <span>من {MAX_SCORE}</span>
            </div>
            <div className="percentage">{displayedPercentage}%</div>
            {result.status && <p className="student-status">{result.status}</p>}
            <div className="progress-track" aria-label={`النسبة المئوية ${displayedPercentage}%`}>
              <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
            </div>
          </div>
        )}

        {searched && !result && (
          <div className="not-found" role="status">
            لم يتم العثور على نتيجة برقم الجلوس هذا.
          </div>
        )}
      </section>
      <footer>Developed by Eng. Abuzaid Saad</footer>
    </main>
  );
}
