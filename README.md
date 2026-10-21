# KVARTEY LAB

Türkçe, üyelik gerektirmeyen etkileşimli deneyim platformu. Next.js App Router, TypeScript ve React ile hazırlanmıştır. Harici API, veritabanı veya ücretli hizmet gerekmez.

## Geliştirme

Node.js 24 (bu ortamda doğrulandı), npm 11.

```sh
cd /workspace/kvartey-lab
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev
```

Üretim: `npm run build`, ardından `npm run start`. Varsayılan port 3000; `PORT` ile değiştirilebilir. Tasarımda dış görsel veya font isteği yoktur; gezegenler ve kartlar yerel CSS ile çizilir. Marka `lib/brand.ts` içinde değiştirilebilir.

## Deneyimler

- `/futbol`: en fazla 10 kariyer, değiştirilebilir oyuncu profili, üç başlangıç yolu, haftalık antrenman, hibrit veya hızlı maç, 8 kulüp ve 14 haftalık çift devreli lig, teklifler ve sezon sonu transferler, çok sezonlu geçmiş, 40 yaşında emeklilik.
- `/ya-soyle-olsaydi`: mesafeye bağlı enerji ve temsili sıcaklık modeli; dinozor, teknoloji ve tarih için dallanan kurgu senaryolar; hazır şablon seçimi.
- `/kesif`: sekiz gezegen, temel bilgiler ve çap karşılaştırması.
- `/mini-oyunlar`: oksijen yönetimi, üç farklı sonuç ve otomatik kayıt ile Son Sinyal macerası.

Oyun mantığı `lib/football.ts`, bilim ve macera modelleri `lib/worlds.ts`, sürümlü kayıt doğrulaması `lib/storage.ts` içinde arayüzden ayrılmıştır. Ortak sayfa kabuğu ve kayıt yönetimi `components/Platform.tsx` içindedir. Yeni kategoriler `lib/brand.ts` ve kategori yönlendiricisine eklenebilir.

## Kayıtlar

Kariyerler, son ziyaretler ve mini macera `localStorage` içinde `kvartey.lab.v1` anahtarıyla saklanır. Kayıtlarım ekranı JSON dışa/içe aktarma, kariyer seçimi ve silme sağlar. İçe aktarma mevcut kayıtları değiştirir; önce yedek alın. Sürümü veya yapısı geçersiz kayıtlar reddedilir. Tarayıcı depolaması kapanır/dolarsa uyarı gösterilir; o oturumdaki ilerleme dışa aktarılabilir. Hesaplar ve cihazlar arası otomatik senkronizasyon yoktur.

## Doğrulama

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
```

Birim testleri fikstürü, iki sezonu, olasılık etkilerini, transferleri, kayıtları ve modelleri doğrular. Playwright üretim sunucusunu başlatır; kariyer, JSON yedek, tam sezon, kayıt sürekliliği, model kontrolleri, macera ve 390px mobil taşma kontrolleri yapar. Bu bulut makinesinde `/usr/bin/chromium` kullanılır. Başka makinede Playwright yapılandırmasındaki `executablePath` değerini yerel Chromium yoluna ayarlayın veya kaldırıp `npx playwright install chromium` çalıştırın.

## Model sınırları

Futbol bir yönetim simülasyonudur; lisanslı kulüp veya gerçek maç verisi kullanmaz. Her lig sezonu aynı sekiz kurgu kulüple yenilenir. Son iki kulübün oyuncuları için düşme hattı, gelişim kulübüne dönüş olarak uygulanır; ayrı alt lig piramidi yoktur. Gol/asist tablosu her kulübün temsilci hücum oyuncusunu gösterir; tam kadro simülasyonu değildir. Transferler sezon sonunda gerçekleşir, tahmini süreler ilk 11 olasılığını etkiler. Genel reyting yedi özelliğin ortalamasıdır; mevki kritik an kararlarına bonus verir. Her maçın skoru, oyuncu dakikası, gol, asist, şut, puan ve gelişim değişimleri kariyer arşivinde korunur.

Dünya modeli ters kare yasası ve Kepler bağıntısı kullanır. Sıcaklık sabit atmosfer/yansıtıcılık varsayımı altında temsili ölçeklemedir, gerçek iklim tahmini değildir. Alternatif hikâyeler kurgudur. Gezegen sayıları yuvarlatılmış NASA Planetary Fact Sheet değerleridir. Serbest metin yapay zekâ üretimi bağlı değildir.

## Vercel

Depoyu Vercel'e aktarın; framework **Next.js**, kök dizin deponun kökü, kurulum `npm ci`, build `npm run build`. Çıktı dizinini varsayılanda bırakın. Ortam değişkeni veya gizli anahtar gerekmez. Node sürümünü 24.x seçin. Vercel hesabına erişim olmadan otomatik yayın yapılmaz. Bu proje sunucusuz barındırmaya uygundur; kayıtlar kullanıcının tarayıcısında kalır.
