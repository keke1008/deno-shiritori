import { Shiritori } from "~/src/shiritori.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("use a initial word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord("しりとり"),
    { isValid: false, reason: "UsedWord" },
  );
});

Deno.test("use a unused word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord("りんご"),
    { isValid: true },
  );
});

Deno.test("use a previous word", () => {
  const s = new Shiritori("しりとり");
  s.ChainNextWord("りんご");
  assertEquals(
    s.validateNextWord("りんご"),
    { isValid: false, reason: "UsedWord" },
  );
});

Deno.test("use a word with an illegal first character", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord("おれんじ"),
    { isValid: false, reason: "IllegalFirstCharacter" },
  );
});

Deno.test("use a zero length word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord(""),
    { isValid: false, reason: "ZeroLengthString" },
  );
});

Deno.test("chain unused word", () => {
  const s = new Shiritori("しりとり");
  s.ChainNextWord("りんご");
  assertEquals(s.previousWord, "りんご");
  assertEquals(s.setOfPreviousWords, new Set(["しりとり", "りんご"]));
});

Deno.test("chain illegal word", () => {
  const s = new Shiritori("しりとり");
  s.ChainNextWord("おれんじ");
  assertEquals(s.previousWord, "しりとり");
  assertEquals(s.setOfPreviousWords, new Set(["しりとり"]));
});
