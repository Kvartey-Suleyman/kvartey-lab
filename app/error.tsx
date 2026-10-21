"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="empty">
      <h1>Bir şeyler ters gitti.</h1>
      <p>Kaydedilmiş ilerlemeniz tarayıcınızda tutulur.</p>
      <button onClick={reset}>Yeniden dene</button>
      <a href="/">Ana sayfa</a>
    </main>
  );
}
