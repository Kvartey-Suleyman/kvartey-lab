import { test, expect } from "@playwright/test";
test("Kariyer: oluştur, antrenman, maç, lig ve yenilemeyle kayıt", async ({
  page,
}) => {
  await page.goto("/futbol");
  await page.getByRole("button", { name: "Kariyere başla" }).click();
  await expect(
    page.getByRole("heading", { name: "KVARTEY", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Bitiricilik", exact: true }).click();
  await expect(page.getByText("Antrenman tamamlandı.")).toBeVisible();
  await page
    .getByRole("button", { name: "Hızlı simüle et", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Maç tamamlandı" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "KVARTEY", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Lig & sezon" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(8);
  await expect(
    page.locator("tbody tr").first().locator("td").first(),
  ).toHaveText("1");
});
test("Mesafe kontrolü ve gezegen karşılaştırması", async ({ page }) => {
  await page.goto("/ya-soyle-olsaydi");
  await page.getByLabel("Güneş’e uzaklık").fill("0.5");
  await expect(page.getByText("×4.00")).toBeVisible();
  await page.getByRole("button", { name: "Bugünkü Dünya" }).click();
  await expect(page.getByText("×1.00")).toBeVisible();
  await page.getByRole("button", { name: "Dinozorlar yok olmasaydı?" }).click();
  await page.getByRole("button", { name: "Kıyı kentleri" }).click();
  await expect(
    page.getByText("Deniz ticareti güçleniyor.", { exact: false }),
  ).toBeVisible();
  await page.goto("/kesif");
  await page.getByRole("button", { name: "Satürn", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Satürn", exact: true }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Karşılaştır", exact: true }).selectOption("2");
  await expect(page.getByText("Satürn / Dünya çap oranı:")).toBeVisible();
});
test("Macera ilerlemesi saklanır ve farklı son denenebilir", async ({
  page,
}) => {
  await page.goto("/mini-oyunlar");
  await page.getByRole("button", { name: "Eski kapsülü incele" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Unutulmuş bir yolcu" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kartuşu tak" }).click();
  await page.getByRole("button", { name: "Kurtarma çağrısı gönder" }).click();
  await expect(page.getByRole("heading", { name: "Eve dönüş" })).toBeVisible();
  await page.getByRole("button", { name: "Farklı bir yol dene" }).click();
  await expect(
    page.getByRole("heading", { name: "Sessiz gezegen" }),
  ).toBeVisible();
});
test("Mobil sayfalar taşmaz, kategori bağlantıları çalışır", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/futbol",
    "/kesif",
    "/mini-oyunlar",
    "/ya-soyle-olsaydi",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Bir ihtimal seç." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Menüyü aç/kapat" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Keşif", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Keşif.", exact: true }),
  ).toBeVisible();
});
test("Bozuk kayıt çökme yerine uyarı verir", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("kvartey.lab.v1", '{"version":1}'),
  );
  await page.reload();
  await expect(
    page.getByRole("alert").filter({ hasText: "Kayıt okunamadı" }),
  ).toContainText("Kayıt okunamadı");
  await page.getByRole("button", { name: "Kayıtları yönet" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("JSON yedek dışa aktarılır, silinir ve içe alınır", async ({ page }) => {
  await page.goto("/futbol");
  await page.getByRole("button", { name: "Kariyere başla" }).click();
  await page.getByRole("button", { name: "Kayıtlarım" }).click();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Dışa aktar" }).click();
  const file = await downloaded;
  const path = await file.path();
  expect(path).toBeTruthy();
  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Tüm kayıtları sıfırla" }).click();
  await expect(page.getByText("Henüz kayıtlı bir kariyer yok.")).toBeVisible();
  await page.locator("input[type=file]").setInputFiles(path!);
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "KVARTEY · Sezon 1" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kayıtları kapat" }).click();
  await expect(
    page.getByRole("heading", { name: "KVARTEY", exact: true }),
  ).toBeVisible();
});
test("Tam sezon sonraki sezona geçer; kariyer geçmişi korunur", async ({
  page,
}) => {
  await page.goto("/futbol");
  await page.getByRole("button", { name: "Kariyere başla" }).click();
  for (let i = 0; i < 14; i++) {
    await page
      .getByRole("button", { name: "Hızlı simüle et", exact: true })
      .click();
    await page.getByRole("button", { name: "Devam et", exact: true }).click();
  }
  await expect(
    page.getByRole("button", { name: "Yeni sezona geç" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yeni sezona geç" }).click();
  await page.getByRole("tab", { name: "Kariyer geçmişi" }).click();
  await expect(page.getByRole("heading", { name: "Sezon 1 ·" })).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "Kariyer geçmişi" }).click();
  await expect(page.getByRole("heading", { name: "Sezon 1 ·" })).toBeVisible();
});
