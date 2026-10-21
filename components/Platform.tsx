"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Compass,
  Gamepad2,
  Orbit,
  Trophy,
  Bookmark,
  Download,
  Upload,
  Trash2,
  Menu,
  X,
  ChevronRight,
  FlaskConical,
} from "lucide-react";
import { brand, categories } from "@/lib/brand";
import { emptySave, parseSave, useSave } from "@/lib/storage";
import Football from "./Football";
import { Worlds, Discovery, Adventure } from "./Worlds";
const icons = [Trophy, Orbit, Compass, Gamepad2];
export default function Platform({ category }: { category?: string }) {
  const state = useSave();
  const { save, update, ready, error, setError } = state;
  const [menu, setMenu] = useState(false),
    [showSaves, setShowSaves] = useState(false),
    [message, setMessage] = useState("");
  const upload = useRef<HTMLInputElement>(null);
  const current = categories.find((c) => c.slug === category);
  useEffect(() => {
    if (ready && category)
      update((s) => ({
        ...s,
        recent: [category, ...s.recent.filter((c) => c !== category)].slice(
          0,
          4,
        ),
      })); /* visited once after hydration */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, category]);
  function exportSave() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(save, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "kvartey-lab-kayit.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Kayıt dosyası indirildi.");
  }
  async function importSave(file?: File) {
    if (!file) return;
    try {
      update(parseSave(await file.text()));
      setMessage("Kayıtlar içe aktarıldı.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dosya okunamadı.");
    }
    if (upload.current) upload.current.value = "";
  }
  return (
    <>
      <a className="skip" href="#main">
        İçeriğe geç
      </a>
      <header>
        <Link href="/" className="logo" aria-label="Kvartey Lab ana sayfa">
          <span className="logo-mark">
            <FlaskConical size={23} />
          </span>
          {brand.name}
          <span className="logo-lab">{brand.suffix}</span>
        </Link>
        <nav aria-label="Ana navigasyon" className={menu ? "open" : ""}>
          <Link href="/#experiences" onClick={() => setMenu(false)}>
            Keşfet
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              className={category === c.slug ? "active" : ""}
              href={`/${c.slug}`}
              onClick={() => setMenu(false)}
            >
              {c.title}
            </Link>
          ))}
        </nav>
        <button
          className="save-button ghost"
          onClick={() => setShowSaves(true)}
        >
          <Bookmark size={17} />
          <span>Kayıtlarım</span>
          <small>{save.careers.length}</small>
        </button>
        <button
          className="mobile-toggle ghost"
          aria-label="Menüyü aç/kapat"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        {error && (
          <div role="alert" className="notice danger">
            {error}
            <button onClick={() => setShowSaves(true)}>Kayıtları yönet</button>
          </div>
        )}
        {message && (
          <div className="notice" role="status">
            {message}
            <button aria-label="Bildirimi kapat" onClick={() => setMessage("")}>
              <X size={16} />
            </button>
          </div>
        )}
        {!category ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="pill">
                  <i /> MERAK EDENLER İÇİN BİR OYUN ALANI
                </span>
                <h1>
                  Bir ihtimal seç.
                  <br />
                  Yeni bir <em>dünya aç.</em>
                </h1>
                <p>
                  Sadece izleme. Sahaya çık, evrenin kurallarını değiştir,
                  <br className="desktop" /> bilinmeyeni keşfet. Burada hikâyeyi
                  sen yazarsın.
                </p>
                <div className="hero-actions">
                  <a href="#experiences" className="btn">
                    Deneyimleri keşfet <ArrowDown size={17} />
                  </a>
                  <Link className="text-link" href="/futbol">
                    Kariyerine başla <ArrowUpRight size={17} />
                  </Link>
                </div>
                <div className="hero-notes">
                  <span>
                    <i /> Ücretsiz keşfet
                  </span>
                  <span>Üyelik gerekmez</span>
                  <span>İlerlemen kaydedilir</span>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orbital orbit-one" />
                <div className="orbital orbit-two" />
                <div className="orbital orbit-three" />
                <div className="planet">
                  <div className="planet-texture" />
                </div>
                <div className="satellite">✦</div>
                <span className="art-label label-one">
                  <i /> OLASILIK 001
                  <br />
                  <b>Ya her şey farklı olsaydı?</b>
                </span>
                <span className="art-label label-two">
                  KEŞİF MODU <b>AKTİF ↗</b>
                </span>
                <span className="art-coordinate">
                  41° 01′ N &nbsp; / &nbsp; SINIRSIZ OLASILIK
                </span>
                <div className="floating-ball">⚽</div>
              </div>
            </section>
            <section id="experiences" className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">MERAKIN NEREYE GÖTÜRÜYOR?</span>
                  <h2>
                    Deneyimleri keşfet<span className="green-dot">.</span>
                  </h2>
                </div>
                <span className="muted small">4 kategori · Sınırsız merak</span>
              </div>
              <div className="category-grid">
                {categories.map((c, i) => {
                  const Icon = icons[i];
                  return (
                    <Link
                      href={`/${c.slug}`}
                      className={`category-card ${c.color}`}
                      key={c.slug}
                    >
                      <div className="card-top">
                        <span className="icon-box">
                          <Icon size={22} />
                        </span>
                        <span className="card-count">{c.count}</span>
                      </div>
                      <div
                        className={`card-visual visual-${i}`}
                        aria-hidden="true"
                      >
                        {i === 0 ? (
                          <>
                            <span className="pitch-lines" />
                            <span className="ball">⚽</span>
                            <span className="shirt-number">10</span>
                          </>
                        ) : i === 1 ? (
                          <>
                            <span className="mini-orbit" />
                            <span className="mini-planet" />
                            <span className="spark">✦</span>
                          </>
                        ) : i === 2 ? (
                          <>
                            <span className="system-sun" />
                            {[1, 2, 3].map((n) => (
                              <span
                                key={n}
                                className={`system-orbit so-${n}`}
                              />
                            ))}
                            <span className="system-earth" />
                          </>
                        ) : (
                          <>
                            <span className="game-tile tile-a">↗</span>
                            <span className="game-tile tile-b">✦</span>
                            <span className="game-tile tile-c">?</span>
                          </>
                        )}
                      </div>
                      <span className="eyebrow">{c.eyebrow}</span>
                      <h3>{c.title}</h3>
                      <p>{c.description}</p>
                      <div className="card-bottom">
                        <span>{c.label}</span>
                        <span className="circle-arrow">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
            <section className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">BUGÜNÜN ROTASI</span>
                  <h2>İlk adımı sen at.</h2>
                </div>
                <span className="tag">EDİTÖRÜN SEÇİMİ</span>
              </div>
              <div className="featured-grid">
                <Link href="/futbol" className="feature football-feature">
                  <div>
                    <span className="pill">⚽ FUTBOL KARİYERİ</span>
                    <h3>
                      Bir forma.
                      <br />
                      Bin ihtimal.
                    </h3>
                    <p>
                      18 yaşındasın. Yeteneğin var.
                      <br />
                      Peki, efsane olmaya hazır mısın?
                    </p>
                    <span className="btn">
                      Kariyerini oluştur <ArrowRight size={17} />
                    </span>
                  </div>
                  <div className="player-card" aria-hidden="true">
                    <span>BAŞLANGIÇ KARTI</span>
                    <b>62</b>
                    <span>FV · TÜRKİYE</span>
                    <div className="jersey">10</div>
                    <strong>KVARTEY</strong>
                    <small>POTANSİYEL 86</small>
                  </div>
                </Link>
                <Link
                  href="/ya-soyle-olsaydi"
                  className="feature universe-feature"
                >
                  <span className="eyebrow">BİR KÜÇÜK DEĞİŞİKLİK</span>
                  <h3>
                    Güneş’e biraz
                    <br />
                    daha yakın olsak?
                  </h3>
                  <p>Bir kaydırıcı. Bambaşka bir Dünya.</p>
                  <span className="text-link">
                    Simülasyonu aç <ArrowUpRight size={17} />
                  </span>
                  <div className="sun-glow" aria-hidden="true" />
                </Link>
              </div>
            </section>
            <section className="section resume-section">
              <div>
                <span className="eyebrow">HİKÂYEN BURADA KALDI</span>
                <h2>Kaldığın yerden devam et.</h2>
                <p className="muted">
                  Kayıtların bu tarayıcıda. Bir sonraki adımın seni bekliyor.
                </p>
              </div>
              <div className="recent-list">
                {!ready ? (
                  <p role="status">Kayıtlar yükleniyor…</p>
                ) : save.recent.length ? (
                  save.recent.map((slug) => {
                    const c = categories.find((c) => c.slug === slug)!;
                    return (
                      <Link key={slug} href={`/${slug}`}>
                        <span className={`recent-icon ${c.color}`}>
                          {c.icon}
                        </span>
                        <span>
                          <b>{c.title}</b>
                          <small>
                            {slug === "futbol" && save.careers.length
                              ? `${save.careers[save.active].profile.name} · Sezon ${save.careers[save.active].season}`
                              : "Keşfetmeye devam et"}
                          </small>
                        </span>
                        <ChevronRight size={20} />
                      </Link>
                    );
                  })
                ) : (
                  <div className="empty-small">
                    <Bookmark />
                    <p>
                      Henüz bir yolculuğun yok.
                      <br />
                      <span>İlk deneyimini seç, hikâyen burada başlasın.</span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="breadcrumb">
              <Link href="/">Ana sayfa</Link>
              <ChevronRight size={14} />
              <span>{current?.title}</span>
            </div>
            <div className="experience-heading">
              <span className="eyebrow">{current?.eyebrow}</span>
              <h1>
                {current?.title}
                <span className="green-dot">.</span>
              </h1>
              <p>{current?.description}</p>
            </div>
            {!ready ? (
              <div className="empty" role="status">
                Kayıtlar hazırlanıyor…
              </div>
            ) : category === "futbol" ? (
              <Football save={save} update={update} />
            ) : category === "ya-soyle-olsaydi" ? (
              <Worlds />
            ) : category === "kesif" ? (
              <Discovery />
            ) : (
              <Adventure save={save} update={update} />
            )}
          </>
        )}
      </main>
      <footer>
        <Link className="logo" href="/">
          <FlaskConical size={19} /> {brand.name}
          <span className="logo-lab">{brand.suffix}</span>
        </Link>
        <p>Merakla başlar. Seninle şekillenir.</p>
        <span>
          © {new Date().getFullYear()} Kvartey Lab{" "}
          <span className="green-dot">✦</span>
        </span>
      </footer>
      {showSaves && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSaves(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="saves-title"
            className="modal"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowSaves(false);
              if (e.key === "Tab") {
                const buttons = e.currentTarget.querySelectorAll<HTMLElement>(
                  "button:not([disabled]),input:not([hidden])",
                );
                const first = buttons[0],
                  last = buttons[buttons.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="section-heading">
              <h2 id="saves-title">Kayıtlarım</h2>
              <button
                autoFocus
                className="ghost"
                aria-label="Kayıtları kapat"
                onClick={() => setShowSaves(false)}
              >
                <X />
              </button>
            </div>
            <p>
              Kayıtlar yalnızca bu tarayıcıda saklanır. Cihaz değiştirmeden önce
              dosya olarak indir.
            </p>
            {save.careers.map((c, i) => (
              <div className="save-row" key={i}>
                <button
                  onClick={() => {
                    update((s) => ({ ...s, active: i }));
                    setShowSaves(false);
                  }}
                >
                  {c.profile.name} · Sezon {c.season}{" "}
                  {i === save.active ? "✓" : ""}
                </button>
                <button
                  className="ghost"
                  aria-label={`${c.profile.name} kariyerini sil`}
                  onClick={() => {
                    if (confirm("Bu kariyer kalıcı olarak silinsin mi?"))
                      update((s) => ({
                        ...s,
                        careers: s.careers.filter((_, j) => j !== i),
                        active: 0,
                      }));
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!save.careers.length && (
              <p className="muted">Henüz kayıtlı bir kariyer yok.</p>
            )}
            <div className="button-row">
              <button onClick={exportSave}>
                <Download size={16} /> Dışa aktar
              </button>
              <button
                className="secondary"
                onClick={() => upload.current?.click()}
              >
                <Upload size={16} /> İçe aktar
              </button>
            </div>
            <p className="small muted">
              İçe aktarma mevcut kayıtların yerini alır. Önce dışa aktararak
              yedekleyin.
            </p>
            <input
              hidden
              type="file"
              ref={upload}
              accept="application/json,.json"
              onChange={(e) => {
                if (
                  e.target.files?.[0] &&
                  confirm(
                    "Mevcut kayıtlar dosyadaki kayıtlarla değiştirilsin mi?",
                  )
                )
                  void importSave(e.target.files[0]);
              }}
            />
            <button
              className="danger-button"
              onClick={() => {
                if (confirm("Tüm kariyerler ve macera ilerlemesi silinsin mi?"))
                  update(emptySave());
              }}
            >
              Tüm kayıtları sıfırla
            </button>
          </section>
        </div>
      )}
    </>
  );
}
