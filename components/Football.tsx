"use client";
import { useEffect, useState } from "react";
import {
  Play,
  FastForward,
  Plus,
  Activity,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { type Save } from "@/lib/storage";
import {
  type Career,
  type Profile,
  attrNames,
  clubs,
  overall,
  value,
  createCareer,
  train,
  startMatch,
  advance,
  quickMatch,
  closeMatch,
  ranking,
  nextSeason,
  transfer,
} from "@/lib/football";
const money = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
export default function Football({
  save,
  update,
}: {
  save: Save;
  update: (fn: (s: Save) => Save) => void;
}) {
  const [creating, setCreating] = useState(false),
    [tab, setTab] = useState("Genel bakış"),
    [automatic, setAutomatic] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: "KVARTEY",
    country: "Türkiye",
    age: 18,
    height: 169,
    position: "Forvet",
    potential: 86,
  });
  const [path, setPath] = useState(0);
  const c = save.careers[save.active];
  function change(fn: (c: Career) => Career) {
    update((s) => ({
      ...s,
      careers: s.careers.map((v, i) => (i === s.active ? fn(v) : v)),
    }));
  }
  useEffect(() => {
    if (!automatic || !c?.match || c.match.finished || c.match.pending) return;
    const timer = setTimeout(() => change((v) => advance(v)), 650);
    return () => clearTimeout(timer); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automatic, c?.match?.minute, c?.match?.pending, c?.match?.finished]);
  if (!c || creating)
    return (
      <section className="panel create-career">
        <div>
          <span className="eyebrow">HER EFSANE BİR YERDEN BAŞLAR</span>
          <h2>Kendi oyuncunu oluştur.</h2>
          <p className="muted">
            Kurgu kulüpler. Gerçek kararlar. İlk sezonun seni bekliyor.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (save.careers.length >= 10) return;
            update((s) => ({
              ...s,
              careers: [...s.careers, createCareer(profile, path)],
              active: s.careers.length,
            }));
            setCreating(false);
          }}
        >
          <div className="form-grid">
            <label>
              Oyuncu adı
              <input
                required
                maxLength={30}
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </label>
            <label>
              Ülke
              <input
                required
                maxLength={30}
                value={profile.country}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
              />
            </label>
            <label>
              Yaş
              <input
                type="number"
                required
                min={16}
                max={35}
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: +e.target.value })
                }
              />
            </label>
            <label>
              Boy (cm)
              <input
                type="number"
                required
                min={150}
                max={210}
                value={profile.height}
                onChange={(e) =>
                  setProfile({ ...profile, height: +e.target.value })
                }
              />
            </label>
            <label>
              Mevki
              <select
                value={profile.position}
                onChange={(e) =>
                  setProfile({ ...profile, position: e.target.value })
                }
              >
                <option>Forvet</option>
                <option>Kanat</option>
                <option>Orta saha</option>
              </select>
            </label>
            <label>
              Potansiyel
              <input
                required
                type="number"
                min={62}
                max={99}
                value={profile.potential}
                onChange={(e) =>
                  setProfile({ ...profile, potential: +e.target.value })
                }
              />
            </label>
          </div>
          <h3>Başlangıç yolunu seç</h3>
          <div className="path-grid">
            {[
              "Alt ligde ilk 11",
              "Rekabetçi başlangıç",
              "Büyük kulübün genç takımı",
            ].map((p, i) => (
              <button
                type="button"
                key={p}
                aria-pressed={path === i}
                className={`path secondary ${path === i ? "selected" : ""}`}
                onClick={() => setPath(i)}
              >
                <b>
                  0{i + 1} · {p}
                </b>
                <span>{clubs[i].name}</span>
                <small>
                  {
                    [
                      "Daha çok süre, daha düşük prestij.",
                      "Dengeli rekabet ve gelişim.",
                      "Yüksek prestij, sınırlı forma şansı.",
                    ][i]
                  }
                </small>
              </button>
            ))}
          </div>
          <div className="button-row">
            <button type="submit" disabled={save.careers.length >= 10}>
              Kariyere başla <ArrowRight size={17} />
            </button>
            {c && (
              <button
                type="button"
                className="secondary"
                onClick={() => setCreating(false)}
              >
                Vazgeç
              </button>
            )}
          </div>
          {save.careers.length >= 10 && (
            <p>
              En fazla 10 kariyer saklanabilir. Kayıtlarım bölümünden bir
              kariyer silin.
            </p>
          )}
        </form>
      </section>
    );
  const m = c.match,
    fixture = c.fixtures[c.week]?.find(
      (f) => f.home === c.club || f.away === c.club,
    );
  const totals = c.history.reduce(
    (s, h) => ({
      games: s.games + h.games,
      goals: s.goals + h.goals,
      assists: s.assists + h.assists,
    }),
    { games: c.games, goals: c.goals, assists: c.assists },
  );
  return (
    <>
      <div className="career-toolbar">
        <div className="tabs" role="tablist" aria-label="Kariyer bölümleri">
          {[
            "Genel bakış",
            "Lig & sezon",
            "Transfer merkezi",
            "Kariyer geçmişi",
          ].map((t) => (
            <button
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? "selected" : "ghost"}
              onClick={() => setTab(t)}
              key={t}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="secondary" onClick={() => setCreating(true)}>
          <Plus size={16} /> Yeni kariyer
        </button>
      </div>
      <div className="career-layout">
        <aside>
          <div className="profile-card">
            <div className="section-heading">
              <span className="eyebrow">
                {c.profile.country} · {c.profile.position}
              </span>
              <span className="rating">{overall(c)}</span>
            </div>
            <div className="profile-shirt">10</div>
            <h2>{c.profile.name}</h2>
            <p>{clubs[c.club].name}</p>
            <div className="profile-meta">
              <span>{c.profile.age} yaş</span>
              <span>{c.profile.height} cm</span>
              <span>Pot. {c.profile.potential}</span>
            </div>
            <strong className="market-value">{money(value(c))}</strong>
            <span className="muted small">Piyasa değeri</span>
          </div>
          <div className="panel attributes">
            <h3>Oyuncu özellikleri</h3>
            {Object.entries(attrNames).map(([k, label]) => (
              <div key={k}>
                <div className="spread">
                  <span>{label}</span>
                  <b>
                    {Math.round(c.attributes[k as keyof typeof c.attributes])}
                  </b>
                </div>
                <meter
                  min={0}
                  max={100}
                  value={c.attributes[k as keyof typeof c.attributes]}
                  aria-label={label}
                />
              </div>
            ))}
            {[
              ["Form", c.form],
              ["Moral", c.morale],
              ["Enerji", c.energy],
              ["Teknik direktör güveni", c.trust],
            ].map(([k, v]) => (
              <div className="spread" key={k}>
                <span>{k}</span>
                <b>{Math.round(+v)}%</b>
              </div>
            ))}
          </div>
        </aside>
        <div className="career-main">
          <div className="stats-grid">
            {[
              ["SEZON", c.season],
              ["HAFTA", `${Math.min(c.week + 1, 14)} / 14`],
              ["GOL", c.goals],
              ["ASİST", c.assists],
            ].map(([label, val]) => (
              <div className="stat" key={label}>
                <span>{label}</span>
                <b>{val}</b>
              </div>
            ))}
          </div>
          {tab === "Genel bakış" && (
            <>
              {c.retired ? (
                <div className="panel">
                  <Trophy />
                  <h2>Güzel bir hikâyeydi.</h2>
                  <p>
                    Kariyer tamamlandı. Geçmişinden tüm sezonlarına
                    bakabilirsin.
                  </p>
                </div>
              ) : c.week === 14 && !m ? (
                <div className="panel season-end">
                  <span className="eyebrow">SEZON SONU</span>
                  <h2>
                    {ranking(c)[0].club === c.club
                      ? "Şampiyon sensin!"
                      : "Bir sezon, onlarca hikâye."}
                  </h2>
                  <p>
                    {ranking(c).findIndex((r) => r.club === c.club) + 1}. sırada
                    bitirdin. {c.goals} gol, {c.assists} asist.
                  </p>
                  <p>
                    Transferleri sezon geçişinden önce değerlendir. Son iki
                    takım düşme hattına girer; oyuncuları gelişim kulübünde
                    yeniden başlar. Lig her sezon sekiz kurgu kulüple yenilenir.
                  </p>
                  <button onClick={() => change(nextSeason)}>
                    Yeni sezona geç <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <section className="panel match-panel">
                  <div className="spread">
                    <span className="eyebrow">
                      {m ? "CANLI MAÇ" : "SIRADAKİ MAÇ"} · UFUK LİGİ
                    </span>
                    <span className="tag">
                      {m ? `${m.minute}′` : `${c.week + 1}. HAFTA`}
                    </span>
                  </div>
                  <div className="scoreboard">
                    <div>
                      <span className="club-crest">
                        {clubs[(m || fixture)!.home].name
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <b>{clubs[(m || fixture)!.home].name}</b>
                      <small>EV SAHİBİ</small>
                    </div>
                    <strong>
                      {m ? `${m.homeGoals} : ${m.awayGoals}` : "VS"}
                    </strong>
                    <div>
                      <span className="club-crest away">
                        {clubs[(m || fixture)!.away].name
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <b>{clubs[(m || fixture)!.away].name}</b>
                      <small>DEPLASMAN</small>
                    </div>
                  </div>
                  {!m ? (
                    <>
                      <label className="tactic">
                        Maç taktiği
                        <select
                          value={c.tactic}
                          onChange={(e) =>
                            change((v) => ({ ...v, tactic: e.target.value }))
                          }
                        >
                          <option>Dengeli</option>
                          <option>Hücum</option>
                          <option>Kontrollü</option>
                        </select>
                      </label>
                      <div className="button-row">
                        <button
                          onClick={() => {
                            change(startMatch);
                            setAutomatic(true);
                          }}
                        >
                          <Play size={16} /> Maça çık
                        </button>
                        <button
                          className="secondary"
                          onClick={() => change(quickMatch)}
                        >
                          <FastForward size={16} /> Hızlı simüle et
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {m.pending && !m.finished && (
                        <div className="decision">
                          <span className="eyebrow">
                            TOP SENDE. NE YAPACAKSIN?
                          </span>
                          <div className="button-row">
                            {[
                              "Şut çek",
                              "Pas ver",
                              "Çalım dene",
                              "Topu sakla",
                              "Riskli hücum",
                            ].map((a) => (
                              <button
                                key={a}
                                className="secondary"
                                onClick={() => change((v) => advance(v, a))}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {!m.finished ? (
                        <div className="button-row">
                          <button
                            className="secondary"
                            onClick={() => setAutomatic(!automatic)}
                          >
                            {automatic ? "Duraklat" : "Otomatik ilerlet"}
                          </button>
                          <button
                            className="ghost"
                            disabled={m.pending}
                            onClick={() => change((v) => advance(v))}
                          >
                            5 dakika ilerlet
                          </button>
                          <button
                            className="ghost"
                            onClick={() => change(quickMatch)}
                          >
                            Tamamını simüle et
                          </button>
                        </div>
                      ) : (
                        <div className="match-result">
                          <h3>Maç tamamlandı</h3>
                          <p>
                            {m.minutes} dakika · {m.goals} gol · {m.assists}{" "}
                            asist · {m.shots} şut ·{" "}
                            <b>{m.rating.toFixed(1)} puan</b>
                          </p>
                          <p className="small muted">
                            Reyting: {overall(c)} (
                            {m.growth.overall >= 0 ? "+" : ""}
                            {m.growth.overall}) · Form: {Math.round(c.form)} (
                            {m.growth.form.toFixed(1)}) · Moral:{" "}
                            {Math.round(c.morale)} ({m.growth.morale.toFixed(1)}
                            )
                          </p>
                          <button
                            onClick={() => {
                              change(closeMatch);
                              setAutomatic(false);
                            }}
                          >
                            Devam et <ArrowRight size={16} />
                          </button>
                        </div>
                      )}
                      <div
                        className="event-log"
                        role="log"
                        aria-label="Maç olayları"
                      >
                        {m.log.map((line, i) => (
                          <p key={`${i}-${line}`}>{line}</p>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}
              <section className="panel">
                <div className="spread">
                  <h3>
                    <Activity size={18} /> Antrenman sahası
                  </h3>
                  <span className="muted small">Haftada 1 seans</span>
                </div>
                <p className="muted">
                  Özelliğini geliştir, enerjini yönet. Yaş ve potansiyel gelişim
                  hızını etkiler.
                </p>
                <div className="training-grid">
                  {(
                    [
                      "finish",
                      "speed",
                      "pass",
                      "dribble",
                      "stamina",
                      "balanced",
                    ] as const
                  ).map((k) => (
                    <button
                      key={k}
                      disabled={c.trained || !!m || c.week === 14 || c.retired}
                      className="secondary"
                      onClick={() => change((v) => train(v, k))}
                    >
                      {k === "balanced" ? "Dengeli gelişim" : attrNames[k]}
                    </button>
                  ))}
                </div>
                {c.trained && (
                  <p role="status" className="small green-text">
                    Antrenman tamamlandı. Yeni seans sonraki hafta.
                  </p>
                )}
              </section>
              <section className="panel">
                <h3>Kariyer haberleri</h3>
                {c.news.slice(0, 5).map((n, i) => (
                  <p className="news" key={i}>
                    <span className="green-dot">✦</span> {n}
                  </p>
                ))}
                {c.last && !m && (
                  <p className="small muted">
                    Son maç: {c.last.homeGoals}–{c.last.awayGoals} · Performans{" "}
                    {c.last.rating.toFixed(1)}
                  </p>
                )}
              </section>
            </>
          )}
          {tab === "Lig & sezon" && (
            <>
              <section className="panel">
                <h2>
                  Ufuk Ligi <span className="muted">/ Sezon {c.season}</span>
                </h2>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Kulüp</th>
                        {["O", "G", "B", "M", "AG", "YG", "P"].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ranking(c).map((r, i) => (
                        <tr
                          key={r.club}
                          className={r.club === c.club ? "own-team" : ""}
                        >
                          <td>{i + 1}</td>
                          <th>{clubs[r.club].name}</th>
                          {[
                            r.played,
                            r.won,
                            r.draw,
                            r.lost,
                            r.gf,
                            r.ga,
                            r.points,
                          ].map((v, j) => (
                            <td key={j}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="small muted">
                  1. sıra: şampiyon · 7–8. sıra: düşme hattı. Her haftada dört
                  maç birlikte simüle edilir.
                </p>
              </section>
              <section className="panel">
                <h3>Gol & asist liderleri</h3>
                <p className="small muted">
                  Her kulübün temsilci hücum oyuncusu listelenir; kendi satırın
                  yalnızca bu kulüpteki katkılarını gösterir.
                </p>
                {[...c.table]
                  .sort((a, b) => b.goals - a.goals)
                  .map((r) => (
                    <div className="spread news" key={r.club}>
                      <span>
                        {r.club === c.club
                          ? c.profile.name
                          : `${clubs[r.club].name} · Takım golcüsü`}
                      </span>
                      <b>
                        {r.goals} gol · {r.assists} asist
                      </b>
                    </div>
                  ))}
              </section>
              <section className="panel">
                <h3>Fikstür</h3>
                {c.fixtures.map((round, i) => (
                  <div className="fixture-row" key={i}>
                    <b>
                      {i + 1}. hafta {i < c.week ? "✓" : ""}
                    </b>
                    <span>
                      {round
                        .map(
                          (f) =>
                            `${clubs[f.home].name} – ${clubs[f.away].name}`,
                        )
                        .join(" / ")}
                    </span>
                  </div>
                ))}
              </section>
            </>
          )}
          {tab === "Transfer merkezi" && (
            <section className="panel">
              <span className="eyebrow">BİR SONRAKİ ADIM</span>
              <h2>Transfer merkezi</h2>
              <p>
                Maaş: {money(c.salary)} / hafta · Sözleşme: {c.contract} sezon
              </p>
              <p className="muted">
                5, 10 ve 14. haftalarda teklifler yenilenir. Transferler sezon
                sonunda, maç ekranı kapatıldıktan sonra tamamlanır. Forma şansı
                tahmindir.
              </p>
              {!c.offers.length ? (
                <div className="empty-small">
                  <p>
                    Şu anda teklif yok. Performansın ve piyasa değerin
                    kulüplerin bütçesine uygun olduğunda teklifler gelecek.
                  </p>
                </div>
              ) : (
                c.offers.map((o) => (
                  <article className="offer" key={o.club}>
                    <div>
                      <h3>{clubs[o.club].name}</h3>
                      <span className="muted">
                        {clubs[o.club].league} · Prestij{" "}
                        {"★".repeat(clubs[o.club].prestige)}
                      </span>
                    </div>
                    <div className="offer-stats">
                      <span>
                        Bedel <b>{money(o.fee)}</b>
                      </span>
                      <span>
                        Maaş <b>{money(o.salary)} / hafta</b>
                      </span>
                      <span>
                        Süre <b>{o.years} sezon</b>
                      </span>
                      <span>
                        Forma <b>%{o.minutes}</b>
                      </span>
                    </div>
                    <p className="small muted">
                      Bütçe: {money(clubs[o.club].budget)} · İhtiyaç:{" "}
                      {clubs[o.club].need}
                    </p>
                    <div className="button-row">
                      <button
                        disabled={c.week !== 14 || !!m}
                        onClick={() => change((v) => transfer(v, o.club))}
                      >
                        Kabul et
                      </button>
                      <button
                        className="secondary"
                        onClick={() =>
                          change((v) => ({
                            ...v,
                            offers: v.offers.filter((x) => x.club !== o.club),
                          }))
                        }
                      >
                        Reddet
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          )}
          {tab === "Kariyer geçmişi" && (
            <>
              <section className="panel">
                <h2>Senin hikâyen</h2>
                <div className="stats-grid">
                  {[
                    ["MAÇ", totals.games],
                    ["GOL", totals.goals],
                    ["ASİST", totals.assists],
                    ["KUPA", c.history.filter((h) => h.place === 1).length],
                  ].map(([l, v]) => (
                    <div className="stat" key={l}>
                      <span>{l}</span>
                      <b>{v}</b>
                    </div>
                  ))}
                </div>
                <h3>Reyting yolculuğu</h3>
                <div
                  className="history-chart"
                  role="img"
                  aria-label={`Reyting gelişimi: ${[62, ...c.history.map((h) => h.overall), overall(c)].join(", ")}`}
                >
                  {[62, ...c.history.map((h) => h.overall), overall(c)].map(
                    (v, i) => (
                      <div key={i}>
                        <span>{v}</span>
                        <i style={{ height: `${v * 1.4}px` }} />
                        <small>{i === 0 ? "Başlangıç" : `S${i}`}</small>
                      </div>
                    ),
                  )}
                </div>
                {!c.history.length && (
                  <p className="muted">
                    İlk sezonunu tamamladığında sezon arşivin burada görünecek.
                  </p>
                )}
                {c.history.map((h, i) => (
                  <div className="news" key={i}>
                    <h3>
                      Sezon {h.season} · {clubs[h.club].name}
                    </h3>
                    <p>
                      {h.games} maç · {h.goals} gol · {h.assists} asist ·{" "}
                      {h.place}. sıra · {h.overall} GEN
                    </p>
                    <span className="green-text">{h.trophy}</span>
                  </div>
                ))}
                <h3>Maç arşivi</h3>
                {c.matchHistory.length ? (
                  <details>
                    <summary>
                      {c.matchHistory.length} kayıtlı maç · Ayrıntıları göster
                    </summary>
                    {[...c.matchHistory].reverse().map((h, i) => (
                      <div className="news" key={i}>
                        <b>
                          S{h.season} · {h.week}. hafta:{" "}
                          {clubs[h.result.home].name} {h.result.homeGoals}–
                          {h.result.awayGoals} {clubs[h.result.away].name}
                        </b>
                        <p>
                          {h.result.minutes} dk · {h.result.goals} gol ·{" "}
                          {h.result.assists} asist · {h.result.shots} şut ·{" "}
                          {h.result.rating.toFixed(1)} puan
                        </p>
                        <span>
                          GEN +{h.result.growth.overall} · Form{" "}
                          {h.result.growth.form.toFixed(1)} · Moral{" "}
                          {h.result.growth.morale.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </details>
                ) : (
                  <p className="muted">
                    İlk maçından sonra arşivin burada görünecek.
                  </p>
                )}
                <h3>Transfer geçmişi</h3>
                {c.transfers.length ? (
                  c.transfers.map((t, i) => <p key={i}>{t}</p>)
                ) : (
                  <p className="muted">
                    İlk kulübün: {clubs[c.path].name}. Henüz transfer yok.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
