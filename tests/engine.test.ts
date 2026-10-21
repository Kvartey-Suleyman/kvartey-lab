import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createCareer,
  quickMatch,
  closeMatch,
  nextSeason,
  ranking,
  train,
  overall,
  startMatch,
  advance,
  transfer,
  schedule,
} from "../lib/football";
import { parseSave, emptySave } from "../lib/storage";
import { solarModel, adventureStep } from "../lib/worlds";
const profile = {
  name: "KVARTEY",
  country: "Türkiye",
  age: 18,
  height: 169,
  position: "Forvet",
  potential: 86,
};
test("Fikstür: her takım her rakiple ev ve deplasmanda karşılaşır", () => {
  const f = schedule();
  assert.equal(f.length, 14);
  for (let i = 0; i < 8; i++) {
    const matches = f.flat().filter((m) => m.home === i || m.away === i);
    assert.equal(matches.length, 14);
    assert.equal(matches.filter((m) => m.home === i).length, 7);
    assert.equal(new Set(matches.map((m) => `${m.home}-${m.away}`)).size, 14);
  }
});
test("İki tam sezon: lig bütünü, kayıt ve gelişim korunur", () => {
  let c = createCareer(profile, 0, 42);
  assert.equal(overall(c), 62);
  for (let season = 1; season <= 2; season++) {
    for (let week = 0; week < 14; week++) {
      c = train(c, "finish");
      const trained = c.attributes.finish;
      c = train(c, "finish");
      assert.equal(c.attributes.finish, trained);
      c = closeMatch(quickMatch(c));
      assert.equal(c.week, week + 1);
      assert.ok(c.table.every((r) => r.played === week + 1));
      assert.equal(
        c.table.reduce((s, r) => s + r.gf, 0),
        c.table.reduce((s, r) => s + r.ga, 0),
      );
      assert.ok(c.last?.finished);
      assert.ok(c.last!.rating >= 3 && c.last!.rating <= 10);
      assert.ok(c.energy >= 0 && c.energy <= 100);
    }
    assert.equal(ranking(c).length, 8);
    c = nextSeason(c);
  }
  assert.equal(c.history.length, 2);
  assert.equal(c.profile.age, 20);
  assert.equal(c.season, 3);
  assert.equal(c.week, 0);
  assert.ok(c.attributes.finish > 64);
  const save = { ...emptySave(), careers: [c] };
  assert.deepEqual(parseSave(JSON.stringify(save)), save);
});
test("Hibrit maç kritik anda bekler ve kararla ilerler", () => {
  let c = startMatch(createCareer(profile, 0, 5));
  c.match!.entered = true;
  for (let i = 0; i < 10 && !c.match!.pending; i++) c = advance(c);
  assert.equal(c.match!.pending, true);
  const minute = c.match!.minute;
  assert.equal(advance(c).match!.minute, minute);
  c = advance(c, "Pas ver");
  assert.equal(c.match!.decisionCount, 1);
  assert.ok(c.match!.minute > minute);
});
test("Aynı tohum tekrarlanabilir, farklı tohumlar farklı sonuçlar verir", () => {
  assert.deepEqual(
    quickMatch(createCareer(profile, 0, 22)),
    quickMatch(createCareer(profile, 0, 22)),
  );
  const results = new Set(
    Array.from({ length: 30 }, (_, i) => {
      const m = quickMatch(createCareer(profile, 0, i)).last!;
      return `${m.homeGoals}:${m.awayGoals}`;
    }),
  );
  assert.ok(results.size > 3);
});
test("Özellikler karar sonuçlarına istatistiksel etki eder", () => {
  let high = 0,
    low = 0;
  for (let i = 0; i < 200; i++) {
    for (const good of [true, false]) {
      let c = startMatch(createCareer(profile, 0, i));
      c.match!.entered = true;
      c.match!.pending = true;
      c.attributes.finish = good ? 95 : 30;
      c.attributes.shot = good ? 95 : 30;
      c = advance(c, "Şut çek");
      if (good) high += c.match!.goals;
      else low += c.match!.goals;
    }
  }
  assert.ok(high > low + 25, `${high} / ${low}`);
});
test("Transfer sezon dışında tamamlanmaz, sezon sonu kulübü arşivde korunur", () => {
  let c = createCareer(profile, 0, 54);
  c.offers = [{ club: 2, salary: 3000, fee: 250000, years: 3, minutes: 20 }];
  assert.equal(transfer(c, 2).club, 0);
  for (let i = 0; i < 14; i++) c = closeMatch(quickMatch(c));
  c.offers = [{ club: 2, salary: 3000, fee: 250000, years: 3, minutes: 20 }];
  c = transfer(c, 2);
  assert.equal(c.club, 2);
  c = nextSeason(c);
  assert.equal(c.history[0].club, 0);
  assert.equal(c.seasonClub, 2);
});
test("Bozuk ve uyumsuz kayıtlar reddedilir", () => {
  assert.throws(() => parseSave("{"));
  assert.throws(() => parseSave('{"version":2}'));
  const s = { ...emptySave(), careers: [createCareer(profile, 0, 1)] };
  s.careers[0].attributes.finish = NaN;
  assert.throws(() => parseSave(JSON.stringify(s)));
  s.careers[0] = createCareer(profile, 0, 1);
  s.careers[0].match = { bad: true } as never;
  assert.throws(() => parseSave(JSON.stringify(s)));
});
test("Güneş modeli ters kare ve Kepler bağıntılarını uygular", () => {
  assert.equal(solarModel(1).energy, 1);
  assert.equal(solarModel(0.5).energy, 4);
  assert.ok(solarModel(1.5).year > 365);
  assert.ok(solarModel(0.8).temperature > solarModel(1).temperature);
});
test("Macera seçimleri farklı sonlara gider ve oksijen sınırlıdır", () => {
  let a = { node: "start", oxygen: 100, log: [] as string[] };
  a = adventureStep(a, 2);
  a = adventureStep(a, 0);
  a = adventureStep(a, 0);
  assert.equal(a.node, "home");
  assert.equal(a.log.length, 3);
  let b = { node: "ridge", oxygen: 20, log: [] as string[] };
  b = adventureStep(b, 0);
  assert.equal(b.node, "lost");
  assert.equal(b.oxygen, 0);
});
