import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <h1>Bu yörüngede bir şey yok.</h1>
      <p>Aradığınız deneyim bulunamadı.</p>
      <Link className="btn" href="/">
        Ana sayfaya dön
      </Link>
    </main>
  );
}
