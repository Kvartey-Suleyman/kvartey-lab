"use client";
import { useState } from "react";
import { ArrowRight, RotateCcw, Sun, Globe, Radio } from "lucide-react";
import { solarModel, planets, adventure, adventureStep } from "@/lib/worlds";
import type { Save } from "@/lib/storage";
const stories = [
  {
    name: "Dinozorlar yok olmasaydı?",
    fact: "Kuşlar, günümüzde yaşayan dinozor soyudur. Kuş olmayan dinozorlar yaklaşık 66 milyon yıl önce yok oldu.",
    question:
      "Büyük çarpışmanın gerçekleşmediği hayali bir dünyada insan yerleşimleri nereye kurulsun?",
    choices: [
      {
        name: "Korunaklı yüksek bölgeler",
        result:
          "Yerleşimler dağlara yayılıyor. Tarım alanları sınırlı, ticaret dağ geçitlerine bağlı. Büyük canlılarla karşılaşmalar azalıyor.",
      },
      {
        name: "Kıyı kentleri",
        result:
          "Deniz ticareti güçleniyor. Kentler savunma duvarları ve koruma koridorlarıyla büyük canlılarla birlikte yaşamayı öğreniyor.",
      },
    ],
  },
  {
    name: "Yapay zekâ hiç gelişmeseydi?",
    fact: "Yapay zekâ araştırmaları 20. yüzyılın ortalarında kurumsallaştı. Teknolojik gelişim tek bir zorunlu yol izlemez.",
    question: "Bu hayali dünyada araştırma bütçesi hangi alana yönelsin?",
    choices: [
      {
        name: "İnsan uzmanlığına yatırım",
        result:
          "Uzman ekipler büyüyor; tıp ve tasarımda kararlar daha yoğun insan emeğiyle alınıyor. Eğitim kapasitesi kritik hâle geliyor.",
      },
      {
        name: "Mekanik otomasyon",
        result:
          "Dar görevler için mekanik ve kurallı sistemler gelişiyor. Esneklik azalırken standart üretim verimli kalıyor.",
      },
    ],
  },
  {
    name: "Alternatif tarih: matbaa gecikseydi?",
    fact: "Hareketli harf baskısı Doğu Asya’da Avrupa’dan önce kullanıldı. Avrupa’da 15. yüzyılda matbaa hızla yayıldı.",
    question:
      "Basılı kitapların yayılmasının yüz yıl geciktiği hayali bir toplumda bilgiyi nasıl aktaralım?",
    choices: [
      {
        name: "Gezici anlatıcı ağları",
        result:
          "Bilgi sözlü olarak hızla dolaşıyor; yerel anlatımlar çeşitleniyor, kaynakları doğrulamak zorlaşıyor.",
      },
      {
        name: "Ortak el yazması kütüphaneleri",
        result:
          "Kopyacılık bir meslek ağına dönüşüyor. Kentlerde bilgi merkezleri kuruluyor; kitaplara erişim eşitsizliği sürüyor.",
      },
    ],
  },
];
export function Worlds() {
  const [distance, setDistance] = useState(1),
    [scenario, setScenario] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [template, setTemplate] = useState("gezegen");
  const model = solarModel(distance),
    story = stories[scenario];
  return (
    <>
      <section className="simulation-grid">
        <div className="space-stage">
          <div className="space-grid" />
          <div className="solar-sun" aria-label="Güneş" />
          <div
            className="orbit-path"
            style={{
              width: `${distance * 220}px`,
              height: `${distance * 150}px`,
            }}
          />
          <div
            className={`solar-earth ${distance < 0.8 ? "hot" : distance > 1.2 ? "cold" : ""}`}
            style={{ left: `${22 + distance * 30}%` }}
            aria-label="Dünya"
          />
          <span className="stage-caption">
            GÜNEŞ ↔ DÜNYA <b>{distance.toFixed(2)} AB</b>
          </span>
          <span className="scale-note">
            Boyutlar ve yörünge temsili, ölçekli değil.
          </span>
        </div>
        <div className="panel">
          <span className="eyebrow">KOZMİK BİR DÜŞÜNCE DENEYİ</span>
          <h2>
            Biraz daha yakın.
            <br />
            Biraz daha farklı.
          </h2>
          <p>Mesafeyi değiştir, Dünya’nın aldığı enerji nasıl değişiyor gör.</p>
          <label className="slider-label" htmlFor="distance">
            Güneş’e uzaklık <b>{distance.toFixed(2)} AB</b>
          </label>
          <input
            id="distance"
            type="range"
            min="0.5"
            max="1.8"
            step="0.01"
            value={distance}
            onChange={(e) => setDistance(+e.target.value)}
          />
          <div className="spread muted small">
            <span>0,50 AB · Yakın</span>
            <span>1,80 AB · Uzak</span>
          </div>
          <button className="secondary reset" onClick={() => setDistance(1)}>
            <RotateCcw size={15} /> Bugünkü Dünya
          </button>
          <div className="model-stats">
            <div>
              <Sun size={18} />
              <span>Alınan enerji</span>
              <b>×{model.energy.toFixed(2)}</b>
            </div>
            <div>
              <Globe size={18} />
              <span>Temsili sıcaklık</span>
              <b>{model.temperature.toFixed(0)} °C</b>
            </div>
            <div>
              <span>Yıl uzunluğu</span>
              <b>{model.year.toFixed(0)} gün</b>
            </div>
          </div>
          <p aria-live="polite">{model.climate}</p>
        </div>
      </section>
      <aside className="science-note">
        <b>Bilimsel model ve sınırları</b>
        <p>
          Enerji oranı 1 / mesafe²; yörünge dönemi Kepler’in üçüncü yasasına
          göre hesaplanır. 1 AB ≈ 149,6 milyon km. Sıcaklık, bugünkü 288 K
          değerini enerji oranının dördüncü köküyle ölçekler. Atmosferin ve
          yansıtıcılığın sabit kaldığı varsayılır; bu bir iklim tahmini
          değildir. Sera geri beslemeleri, bulutlar, okyanuslar ve yörünge
          kararlılığı modellenmez.
        </p>
        <span className="small muted">
          Kaynak çerçevesi: NASA gezegen bilgi föyleri; ters kare yasası ve
          Kepler yasaları.
        </span>
      </aside>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BAŞKA TÜRLÜ BİR DÜNYA</span>
            <h2>Bir seçim. Başka bir hikâye.</h2>
          </div>
        </div>
        <div className="tabs">
          {stories.map((s, i) => (
            <button
              key={s.name}
              className={i === scenario ? "selected" : "secondary"}
              onClick={() => {
                setScenario(i);
                setChoice(null);
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="story-grid">
          <div className="panel">
            <span className="tag">BİLİNEN GERÇEK</span>
            <p>{story.fact}</p>
          </div>
          <div className="panel">
            <span className="tag purple-text">KURGUSAL SENARYO</span>
            <h3>{story.question}</h3>
            <div className="button-row">
              {story.choices.map((c, i) => (
                <button
                  className={choice === i ? "selected" : "secondary"}
                  key={c.name}
                  onClick={() => setChoice(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {choice !== null && (
              <p aria-live="polite" className="scenario-result">
                {story.choices[choice].result}
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="panel template-panel">
        <h2>Senin ihtimalin ne?</h2>
        <p className="muted">
          Bu sürüm hazır şablonlarla çalışır. Serbest metin üreten bir yapay
          zekâ servisi bağlı değildir.
        </p>
        <label>
          Bir senaryo şablonu seç
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="gezegen">
              Bir gezegenin koşullarını değiştirsem?
            </option>
            <option value="canlilar">
              Canlıların tarihi farklı gelişseydi?
            </option>
            <option value="teknoloji">
              Teknoloji başka bir yol izleseydi?
            </option>
          </select>
        </label>
        <button
          onClick={() => {
            if (template === "gezegen") {
              setDistance(0.75);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setScenario(template === "canlilar" ? 0 : 1);
              setChoice(null);
            }
          }}
        >
          Şablonu uygula <ArrowRight size={16} />
        </button>
      </section>
    </>
  );
}
export function Discovery() {
  const [selected, setSelected] = useState(2),
    [compare, setCompare] = useState(3);
  const p = planets[selected],
    q = planets[compare];
  return (
    <>
      <div className="planet-selector" aria-label="Gezegen seçimi">
        {planets.map((p, i) => (
          <button
            key={p.name}
            aria-pressed={selected === i}
            className={selected === i ? "selected" : "secondary"}
            onClick={() => setSelected(i)}
          >
            <i style={{ background: p.color }} />
            {p.name}
          </button>
        ))}
      </div>
      <section className="discovery-grid">
        <div className="planet-stage">
          <div
            className="display-planet"
            style={{
              background: `radial-gradient(circle at 28% 28%, ${p.color}, ${p.color} 22%, #0b1220 88%)`,
            }}
          >
            <div className="planet-stripes" />
          </div>
          {p.name === "Satürn" && <div className="saturn-ring" />}
          <span className="stage-caption">
            GÜNEŞ SİSTEMİ <b>0{selected + 1} / 08</b>
          </span>
          <span className="scale-note">
            Renkler ve yüzey detayları temsili.
          </span>
        </div>
        <div className="panel">
          <span className="eyebrow">{p.kind.toUpperCase()}</span>
          <h2 className="planet-title">{p.name}</h2>
          <p>{p.fact}</p>
          <div className="fact-grid">
            <div>
              <span>Ortalama çap</span>
              <b>{p.size.toLocaleString("tr-TR")} km</b>
            </div>
            <div>
              <span>Güneş’e ort. uzaklık</span>
              <b>{p.distance.toLocaleString("tr-TR")} milyon km</b>
            </div>
            <div>
              <span>Yörünge dönemi</span>
              <b>{p.year}</b>
            </div>
            <div>
              <span>Doğal uydu</span>
              <b>{p.moons === null ? "Çok sayıda" : p.moons}</b>
            </div>
          </div>
          <p className="small muted">
            Değerler yuvarlanmıştır. Dev gezegenlerin bilinen uydu sayıları yeni
            gözlemlerle değiştiğinden burada sabit sayı verilmez.
          </p>
        </div>
      </section>
      <section className="panel comparison">
        <div>
          <span className="eyebrow">YAN YANA BAK</span>
          <h2>Bir gezegen, ne kadar büyük?</h2>
          <label htmlFor="compare-planet">
            Karşılaştır
            <select
              id="compare-planet"
              value={compare}
              onChange={(e) => setCompare(+e.target.value)}
            >
              {planets.map((p, i) => (
                <option value={i} key={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="comparison-bars">
          <div>
            <span>{p.name}</span>
            <i
              style={{
                width: `${(p.size / Math.max(p.size, q.size)) * 100}%`,
                background: p.color,
              }}
            />
            <b>{p.size.toLocaleString("tr-TR")} km</b>
          </div>
          <div>
            <span>{q.name}</span>
            <i
              style={{
                width: `${(q.size / Math.max(p.size, q.size)) * 100}%`,
                background: q.color,
              }}
            />
            <b>{q.size.toLocaleString("tr-TR")} km</b>
          </div>
          <p>
            {p.name} / {q.name} çap oranı:{" "}
            <strong>{(p.size / q.size).toFixed(2)}</strong>
          </p>
        </div>
      </section>
      <p className="small muted">
        Kaynak: NASA Planetary Fact Sheet. Uzaklıklar ortalama yörünge
        yarıçapıdır; gerçek uzaklık yıl boyunca değişir.
      </p>
      <div className="coming-soon">
        <span className="tag">YAKINDA</span>
        <span>Derin okyanus · Uygarlıklar atlası · İnsan vücudu</span>
      </div>
    </>
  );
}
export function Adventure({
  save,
  update,
}: {
  save: Save;
  update: (fn: (s: Save) => Save) => void;
}) {
  const a = save.adventure,
    node = adventure[a.node] || adventure.start;
  return (
    <section className="adventure-layout">
      <div className="adventure-art" aria-hidden="true">
        <div className="alien-moon" />
        <div className="mountain mountain-back" />
        <div className="mountain mountain-front" />
        <div className="astronaut">♙</div>
        <span>KEŞİF GÖREVİ / 001</span>
      </div>
      <div className="panel adventure-panel">
        <div className="spread">
          <span className="eyebrow">SON SİNYAL</span>
          <span className="tag">
            <Radio size={12} /> O₂ %{a.oxygen}
          </span>
        </div>
        <progress aria-label="Kalan oksijen" max={100} value={a.oxygen} />
        <h2>{node.title}</h2>
        <p>{node.text}</p>
        <div className="adventure-choices">
          {node.choices.map((c, i) => (
            <button
              key={c.text}
              className="secondary"
              onClick={() =>
                update((s) => ({
                  ...s,
                  adventure: adventureStep(s.adventure, i),
                }))
              }
            >
              <span>
                {c.text}
                <small>
                  {c.cost > 0 ? `${c.cost} oksijen harcar` : "Yedek kartuş"}
                </small>
              </span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
        {node.ending && (
          <>
            <span className="tag">
              MACERA TAMAMLANDI ·{" "}
              {a.node === "lost"
                ? "ACİL UYKU"
                : a.node === "home"
                  ? "KURTARILDI"
                  : "VERİLER ULAŞTI"}
            </span>
            <button
              className="reset"
              onClick={() =>
                update((s) => ({
                  ...s,
                  adventure: { node: "start", oxygen: 100, log: [] },
                }))
              }
            >
              <RotateCcw size={16} /> Farklı bir yol dene
            </button>
          </>
        )}
        <p className="small muted">
          İlerlemen otomatik kaydedilir. Oksijenini yönet; her yol aynı yere
          çıkmaz.
        </p>
        {a.log.length > 0 && (
          <details>
            <summary>Yolculuk günlüğü ({a.log.length})</summary>
            <ol>
              {a.log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </section>
  );
}
