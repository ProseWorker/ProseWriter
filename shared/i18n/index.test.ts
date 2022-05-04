import i18n from "i18next";
import de_DE from "./locales/de_DE/translation.json";
import en_US from "./locales/en_US/translation.json";
import pt_PT from "./locales/pt_PT/translation.json";
import { initI18n } from ".";

describe("i18n process.env is unset", () => {
  beforeEach(() => {
    delete process.env.DEFAULT_LANGUAGE;
    initI18n()
      .addResources("en-US", "translation", en_US)
      .addResources("de-DE", "translation", de_DE)
      .addResources("pt-PT", "translation", pt_PT);
  });

  it("translation of key should match", () =>
    expect(i18n.t("Saving")).toBe("Saving"));

  it("translation if changed to de-DE", () => {
    i18n.changeLanguage("de-DE");
    expect(i18n.t("Saving")).toBe("Speichert");
  });

  it("translation if changed to pt-PT", () => {
    i18n.changeLanguage("pt-PT");
    expect(i18n.t("Saving")).toBe("A guardar");
  });
});
describe("i18n process.env is en-US", () => {
  beforeEach(() => {
    process.env.DEFAULT_LANGUAGE = "en-US";
    initI18n()
      .addResources("en-US", "translation", en_US)
      .addResources("de-DE", "translation", de_DE)
      .addResources("pt-PT", "translation", pt_PT);
  });

  it("translation of key should match", () =>
    expect(i18n.t("Saving")).toBe("Saving"));

  it("translation if changed to de-DE", () => {
    i18n.changeLanguage("de-DE");
    expect(i18n.t("Saving")).toBe("Speichert");
  });

  it("translation if changed to pt-PT", () => {
    i18n.changeLanguage("pt-PT");
    expect(i18n.t("Saving")).toBe("A guardar");
  });
});
describe("i18n process.env is de-DE", () => {
  beforeEach(() => {
    process.env.DEFAULT_LANGUAGE = "de-DE";
    initI18n()
      .addResources("en-US", "translation", en_US)
      .addResources("de-DE", "translation", de_DE)
      .addResources("pt-PT", "translation", pt_PT);
  });

  it("translation of key should match", () =>
    expect(i18n.t("Saving")).toBe("Speichert"));

  it("translation if changed to en-US", () => {
    i18n.changeLanguage("en-US");
    expect(i18n.t("Saving")).toBe("Saving");
  });

  it("translation if changed to pt-PT", () => {
    i18n.changeLanguage("pt-PT");
    expect(i18n.t("Saving")).toBe("A guardar");
  });
});
describe("i18n process.env is pt-PT", () => {
  beforeEach(() => {
    process.env.DEFAULT_LANGUAGE = "pt-PT";
    initI18n()
      .addResources("en-US", "translation", en_US)
      .addResources("de-DE", "translation", de_DE)
      .addResources("pt-PT", "translation", pt_PT);
  });

  it("translation of key should match", () =>
    expect(i18n.t("Saving")).toBe("A guardar"));

  it("translation if changed to en-US", () => {
    i18n.changeLanguage("en-US");
    expect(i18n.t("Saving")).toBe("Saving");
  });

  it("translation if changed to de-DE", () => {
    i18n.changeLanguage("de-DE");
    expect(i18n.t("Saving")).toBe("Speichert");
  });
});
