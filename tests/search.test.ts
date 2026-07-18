import { describe, expect, it } from "vitest";

import { filterSearchItems } from "@/lib/content/search";

describe("search index", () => {
  it("finds antibiotic therapy by antibiotic name", () => {
    const results = filterSearchItems("cefazolina");

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: "/appunti/terapia-antibiotica",
          title: "Farmaci antibiotici"
        })
      ])
    );
  });

  it("finds status epilepticus therapy by drug name", () => {
    const results = filterSearchItems("midazolam");

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: "/appunti/stato-male-epilettico",
          title: "Terapia dello stato di male epilettico"
        })
      ])
    );
  });

  it("includes calculators outside the emergency section", () => {
    expect(filterSearchItems("creatinina")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/calcolatori/egfr-pediatrico", title: "eGFR pediatrico" })
      ])
    );

    expect(filterSearchItems("glasgow")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/emergenze/gcs-pediatrico", title: "GCS pediatrico" })
      ])
    );
  });

  it("matches text regardless of accents", () => {
    expect(filterSearchItems("velocita")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/calcolatori/velocita-crescita", title: "Velocità di crescita" })
      ])
    );
  });

  it("finds antiemetic therapy by drug name", () => {
    expect(filterSearchItems("palonosetron")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/appunti/terapia-antiemetica", title: "Terapia antiemetica" })
      ])
    );

    expect(filterSearchItems("aprepitant")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/appunti/terapia-antiemetica", title: "Terapia antiemetica" })
      ])
    );

    expect(filterSearchItems("clorpromazina")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/appunti/terapia-antiemetica", title: "Terapia antiemetica" })
      ])
    );
  });
});
