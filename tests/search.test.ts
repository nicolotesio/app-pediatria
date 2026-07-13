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
});
