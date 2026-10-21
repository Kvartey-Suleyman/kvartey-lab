# Geliştirme durumu

- Dört kategori gerçek sayfalara bağlı; ana sayfa, son ziyaretler ve kayıt yönetimi mevcut.
- Futbol motoru: fikstür, hibrit maç, özelliklere bağlı kararlar, hızlı maç, antrenman, sezonlar, transfer, geçmiş.
- Dünya–Güneş modeli, üç alternatif hikâye, sekiz gezegenli keşif ve dallanan mini macera mevcut.
- Harici API ve hesap gerekmiyor; kayıtlar sürüm doğrulamasıyla tarayıcıda saklanıyor.
- Kısıtlar README'de açıklandı: basitleştirilmiş lig/düşme ve kadro modeli; temsili iklim modeli.
- Doğrulama: 9/9 motor-model-kayıt testi ve 7/7 Chromium uçtan uca testi geçti. TypeScript kontrolü, üretim derlemesi ve temiz kilit dosyasıyla npm ci başarılı. Beş geliştirme rotası HTTP 200 döndü; tarayıcı çalışma hatası görülmedi. Üretim bağımlılık denetiminde 0 bilinen açık raporlandı. Testler `tests/` altında tekrar çalıştırılabilir.
- Bulut yapılandırma taslağına install_script ve start_skill kaydedildi. Bu kayıt yayın anlamına gelmez; kullanıcı ortam ayarlarından inceleyip kaydettikten sonra ortamı yayımlar. Yeni görevde snapshot geri yüklemesi henüz doğrulanmadı.
- Yayın Vercel hesap bağlantısı gerektirir; henüz dış ortama yayınlanmadı.

Sonraki isteğe bağlı geliştirmeler: tam kadro oyuncu istatistikleri, ayrı alt ligler, tam maç geçmişi, ek keşifler ve cihazlar arası eşitleme. Bunlar ilk sürümde mevcutmuş gibi gösterilmez.
