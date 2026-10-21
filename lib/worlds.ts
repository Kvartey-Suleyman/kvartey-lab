export function solarModel(distance: number) {
  const au = Math.max(0.5, Math.min(1.8, distance));
  const energy = 1 / (au * au);
  return {
    au,
    energy,
    temperature: 288 * Math.pow(energy, 0.25) - 273.15,
    year: 365.25 * Math.pow(au, 1.5),
    climate:
      au < 0.8
        ? "Yoğun ısınma; okyanuslarda buharlaşma ve yaşanabilirlik riski."
        : au > 1.2
          ? "Şiddetli soğuma; buz örtüsünün genişlemesi olası."
          : "Günümüze yakın enerji aralığı; iklim yine çok sayıda etkene bağlı.",
  };
}
export const planets = [
  {
    name: "Merkür",
    color: "#b4a494",
    size: 4879,
    distance: 57.9,
    year: "88 gün",
    moons: 0,
    fact: "Güneş’e en yakın gezegen olmasına rağmen en sıcak gezegen değildir.",
    kind: "Kayasal",
  },
  {
    name: "Venüs",
    color: "#deb681",
    size: 12104,
    distance: 108.2,
    year: "225 gün",
    moons: 0,
    fact: "Kalın atmosferinin sera etkisi yüzeyini yaklaşık 465 °C’ye çıkarır.",
    kind: "Kayasal",
  },
  {
    name: "Dünya",
    color: "#4aa9bc",
    size: 12742,
    distance: 149.6,
    year: "365,25 gün",
    moons: 1,
    fact: "Yüzeyinde kalıcı sıvı su bulunduğunu bildiğimiz tek gezegen.",
    kind: "Kayasal",
  },
  {
    name: "Mars",
    color: "#cc6d4c",
    size: 6779,
    distance: 227.9,
    year: "687 gün",
    moons: 2,
    fact: "Olympus Mons, Güneş Sistemi’nin en büyük volkanlarından biridir.",
    kind: "Kayasal",
  },
  {
    name: "Jüpiter",
    color: "#cba987",
    size: 139820,
    distance: 778.6,
    year: "11,86 yıl",
    moons: null,
    fact: "Büyük Kırmızı Leke, yüzyıllardır gözlenen dev bir fırtınadır.",
    kind: "Gaz devi",
  },
  {
    name: "Satürn",
    color: "#cfc090",
    size: 116460,
    distance: 1433.5,
    year: "29,45 yıl",
    moons: null,
    fact: "Yoğunluğu sudan düşüktür. Halkaları çoğunlukla buz parçalarından oluşur.",
    kind: "Gaz devi",
  },
  {
    name: "Uranüs",
    color: "#8acbd0",
    size: 50724,
    distance: 2872.5,
    year: "84 yıl",
    moons: null,
    fact: "Dönme ekseni yaklaşık 98° eğiktir; yörüngesinde yan yatmış gibi döner.",
    kind: "Buz devi",
  },
  {
    name: "Neptün",
    color: "#526fd5",
    size: 49244,
    distance: 4495.1,
    year: "164,8 yıl",
    moons: null,
    fact: "Atmosferinde ses hızını aşabilen çok güçlü rüzgârlar gözlenir.",
    kind: "Buz devi",
  },
];
export type AdventureNode = {
  title: string;
  text: string;
  choices: { text: string; next: string; cost: number }[];
  ending?: boolean;
};
export const adventure: Record<string, AdventureNode> = {
  start: {
    title: "Sessiz gezegen",
    text: "Keşif kapsülün bilinmeyen bir gezegene indi. Telsizinde zayıf bir sinyal var. Ufukta ışıldayan bir sırt ve yakında eski bir kapsül görüyorsun.",
    choices: [
      { text: "Sinyali takip et", next: "signal", cost: 20 },
      { text: "Sırta tırman", next: "ridge", cost: 30 },
      { text: "Eski kapsülü incele", next: "pod", cost: 10 },
    ],
  },
  signal: {
    title: "Yüzeyin altındaki ses",
    text: "Sinyal bir mağaradan geliyor. Girişteki izler yapay. İçeri girmek riskli, ama bir verici bulabilirsin.",
    choices: [
      { text: "Mağaraya gir", next: "cave", cost: 25 },
      { text: "Sırttan çevreyi tara", next: "ridge", cost: 20 },
    ],
  },
  ridge: {
    title: "Ufuktaki istasyon",
    text: "Tepeden bir kurtarma istasyonu görüyorsun. Uzakta bir kum fırtınası yaklaşıyor.",
    choices: [
      { text: "İstasyona koş", next: "home", cost: 35 },
      { text: "Kayaların arkasına verici kur", next: "beacon", cost: 15 },
    ],
  },
  pod: {
    title: "Unutulmuş bir yolcu",
    text: "Kapsülde bir oksijen kartuşu ve eski bir harita buldun. Harita mağarayı bir iletişim merkezi olarak işaretliyor.",
    choices: [
      {
        text: "Kartuşu tak ve mağaraya ilerle (+20 O₂)",
        next: "cave",
        cost: -20,
      },
      { text: "Haritayla sırta çık", next: "ridge", cost: 10 },
    ],
  },
  cave: {
    title: "Bir zamanlar burada biri vardı",
    text: "İçeride çalışan bir anten var. Gücü sınırlı. Yardım çağrısı gönderebilir veya keşif verilerini yükleyebilirsin.",
    choices: [
      { text: "Kurtarma çağrısı gönder", next: "home", cost: 15 },
      { text: "Verileri aktar ve acil işaret bırak", next: "beacon", cost: 25 },
    ],
  },
  home: {
    title: "Eve dönüş",
    text: "Gökyüzünde bir ışık belirdi. Yardım çağrın alındı. Kurtarma ekibi seni ve bulgularını güvenle aldı. Yolculuğun yeni bir keşfin başlangıcı oldu.",
    choices: [],
    ending: true,
  },
  beacon: {
    title: "Yıldızlara bırakılan iz",
    text: "Vericin çalışıyor. Korunaklı bir noktada beklerken keşif verilerin merkeze ulaştı. Hem sen hem de bu gezegen artık yalnız değilsiniz.",
    choices: [],
    ending: true,
  },
  lost: {
    title: "Oksijen tükendi",
    text: "Rotan çok uzundu. Kapsülün acil kurtarma sistemi seni uyku moduna aldı. Bir sonraki denemede daha kısa bir yol veya yedek oksijen bulmalısın.",
    choices: [],
    ending: true,
  },
};
export function adventureStep(
  state: { node: string; oxygen: number; log: string[] },
  index: number,
) {
  const n = adventure[state.node],
    choice = n?.choices[index];
  if (!choice || n.ending) return state;
  const oxygen = Math.max(0, Math.min(100, state.oxygen - choice.cost));
  return {
    node: oxygen <= 0 ? "lost" : choice.next,
    oxygen,
    log: [...state.log, choice.text],
  };
}
