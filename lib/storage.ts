import { useEffect, useRef, useState } from "react";
import { createCareer, type Career } from "./football";
export const saveKey = "kvartey.lab.v1";
export type Save = {
  version: 1;
  careers: Career[];
  active: number;
  adventure: { node: string; oxygen: number; log: string[] };
  recent: string[];
};
export const emptySave = (): Save => ({
  version: 1,
  careers: [],
  active: 0,
  adventure: { node: "start", oxygen: 100, log: [] },
  recent: [],
});
const obj = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const num = (x: unknown, min: number, max: number): x is number =>
  typeof x === "number" && Number.isFinite(x) && x >= min && x <= max;
const str = (x: unknown) => typeof x === "string" && x.length <= 500;
export function validateSave(x: unknown): x is Save {
  if (
    !obj(x) ||
    x.version !== 1 ||
    !Array.isArray(x.careers) ||
    x.careers.length > 10 ||
    !num(x.active, 0, 9) ||
    !Number.isInteger(x.active) ||
    !Array.isArray(x.recent) ||
    x.recent.length > 10 ||
    !x.recent.every(
      (v) =>
        typeof v === "string" &&
        ["futbol", "ya-soyle-olsaydi", "kesif", "mini-oyunlar"].includes(v),
    ) ||
    !obj(x.adventure) ||
    ![
      "start",
      "signal",
      "ridge",
      "pod",
      "cave",
      "home",
      "lost",
      "beacon",
    ].includes(String(x.adventure.node)) ||
    !num(x.adventure.oxygen, 0, 100) ||
    !Array.isArray(x.adventure.log) ||
    x.adventure.log.length > 100 ||
    !x.adventure.log.every(str)
  )
    return false;
  if (x.careers.length && x.active >= x.careers.length) return false;
  return x.careers.every((raw) => {
    if (!obj(raw) || !obj(raw.profile)) return false;
    const p = raw.profile;
    if (
      !str(p.name) ||
      !str(p.country) ||
      !str(p.position) ||
      !num(p.age, 16, 100) ||
      !num(p.height, 150, 210) ||
      !num(p.potential, 62, 99)
    )
      return false;
    const base = createCareer(p as unknown as Career["profile"], 0, 1);
    for (const [k, v] of Object.entries(base)) {
      const a = raw[k];
      if (typeof v === "number" && !num(a, 0, k === "seed" ? 4294967295 : 1e12))
        return false;
      if (typeof v === "boolean" && typeof a !== "boolean") return false;
      if (typeof v === "string" && !str(a)) return false;
      if (Array.isArray(v) && !Array.isArray(a)) return false;
    }
    if (
      raw.version !== 1 ||
      !num(raw.club, 0, 7) ||
      !Number.isInteger(raw.club) ||
      !num(raw.week, 0, 14) ||
      !Number.isInteger(raw.week) ||
      !num(raw.path, 0, 2) ||
      !num(raw.seasonClub, 0, 7) ||
      !Number.isInteger(raw.seasonClub) ||
      !obj(raw.attributes) ||
      Object.keys(base.attributes).some(
        (k) => !num((raw.attributes as Record<string, unknown>)[k], 0, 100),
      )
    )
      return false;
    if (
      !Array.isArray(raw.table) ||
      raw.table.length !== 8 ||
      new Set(raw.table.map((r) => (obj(r) ? r.club : null))).size !== 8 ||
      !raw.table.every(
        (r) =>
          obj(r) &&
          Object.keys(base.table[0]).every((k) =>
            num(r[k], 0, k === "club" ? 7 : 1e6),
          ) &&
          Number.isInteger(r.club),
      )
    )
      return false;
    if (
      !Array.isArray(raw.fixtures) ||
      JSON.stringify(raw.fixtures) !== JSON.stringify(base.fixtures)
    )
      return false;
    const validMatch = (m: unknown) =>
      m === null ||
      (obj(m) &&
        [
          "minute",
          "home",
          "away",
          "homeGoals",
          "awayGoals",
          "goals",
          "assists",
          "shots",
          "minutes",
          "rating",
          "decisionCount",
        ].every((k) =>
          num(
            m[k],
            0,
            k === "home" || k === "away" ? 7 : k === "rating" ? 10 : 1000,
          ),
        ) &&
        Number.isInteger(m.home) &&
        Number.isInteger(m.away) &&
        ["starter", "entered", "pending", "finished"].every(
          (k) => typeof m[k] === "boolean",
        ) &&
        obj(m.before) &&
        obj(m.growth) &&
        ["overall", "form", "morale"].every(
          (k) =>
            num((m.before as Record<string, unknown>)[k], 0, 100) &&
            num((m.growth as Record<string, unknown>)[k], -100, 100),
        ) &&
        Array.isArray(m.log) &&
        m.log.length <= 500 &&
        m.log.every(str));
    if (
      !validMatch(raw.match) ||
      !validMatch(raw.last) ||
      !Array.isArray(raw.matchHistory) ||
      raw.matchHistory.length > 1200 ||
      !raw.matchHistory.every(
        (h) =>
          obj(h) &&
          num(h.season, 1, 100) &&
          num(h.week, 1, 14) &&
          num(h.club, 0, 7) &&
          Number.isInteger(h.club) &&
          h.result !== null &&
          validMatch(h.result),
      )
    )
      return false;
    if (
      !Array.isArray(raw.news) ||
      !raw.news.every(str) ||
      !Array.isArray(raw.transfers) ||
      !raw.transfers.every(str) ||
      !Array.isArray(raw.offers) ||
      !raw.offers.every(
        (o) =>
          obj(o) &&
          ["club", "salary", "fee", "years", "minutes"].every((k) =>
            num(o[k], 0, k === "club" ? 7 : 1e12),
          ) &&
          Number.isInteger(o.club),
      )
    )
      return false;
    return (
      Array.isArray(raw.history) &&
      raw.history.every(
        (h) =>
          obj(h) &&
          [
            "season",
            "club",
            "games",
            "goals",
            "assists",
            "overall",
            "place",
          ].every((k) => num(h[k], 0, k === "club" ? 7 : 1e9)) &&
          Number.isInteger(h.club) &&
          str(h.trophy),
      )
    );
  });
}
export function parseSave(text: string): Save {
  if (text.length > 2000000) throw Error("Kayıt dosyası çok büyük.");
  const x: unknown = JSON.parse(text);
  if (!validateSave(x))
    throw Error("Kayıt yapısı geçersiz veya sürüm desteklenmiyor.");
  return x;
}
export function useSave() {
  const [save, setSave] = useState<Save>(emptySave);
  const saveRef = useRef(save);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(saveKey);
      if (raw) {
        saveRef.current = parseSave(raw);
        setSave(saveRef.current);
      }
    } catch {
      setError(
        "Kayıt okunamadı. Dosyadan içe aktarabilir veya kayıtları sıfırlayabilirsiniz.",
      );
    }
    setReady(true);
  }, []);
  function update(fn: Save | ((s: Save) => Save)) {
    const next = typeof fn === "function" ? fn(saveRef.current) : fn;
    saveRef.current = next;
    setSave(next);
    try {
      localStorage.setItem(saveKey, JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "Tarayıcı kaydetmeye izin vermedi. İlerlemenizi JSON olarak dışa aktarın.",
      );
    }
  }

  return { save, update, ready, error, setError };
}
