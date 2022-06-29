import { Shiritori, ShiritoriGame } from "~/src/shiritori.ts";
import {
  assertEquals,
  AssertionError,
  assertThrows,
} from "std/testing/asserts.ts";

Deno.test("validate a normal word", () => {
  assertEquals(
    Shiritori.staticValidation("しりとり"),
    { isValid: true },
  );
});

Deno.test("validate a zero length word", () => {
  assertEquals(
    Shiritori.staticValidation(""),
    { isValid: false, error: "ZeroLengthString" },
  );
});

Deno.test("validate a word that contains non-hiragana character", () => {
  assertEquals(
    Shiritori.staticValidation("apple"),
    { isValid: false, error: "ContainsNonHiraganaCharacter" },
  );
});

Deno.test("construct with a word that fail in staticValidation", () => {
  assertThrows(() => new Shiritori(""), AssertionError);
});

Deno.test("use a word that fail in staticValidation", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord(""),
    { isValid: false, error: "ZeroLengthString" },
  );
});

Deno.test("use a initial word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord("しりとり"),
    { isValid: false, error: "UsedWord" },
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
  s.chainNextWord("りんご");
  assertEquals(
    s.validateNextWord("りんご"),
    { isValid: false, error: "UsedWord" },
  );
});

Deno.test("use a word with an illegal first character", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.validateNextWord("おれんじ"),
    { isValid: false, error: "IllegalFirstCharacter" },
  );
});

Deno.test("chain unused word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.chainNextWord("りんご"),
    { success: true, becomeInActive: false },
  );
  assertEquals(s.previousWord, "りんご");
  assertEquals(s.setOfPreviousWords, new Set(["しりとり", "りんご"]));
});

Deno.test("chain illegal word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(s.chainNextWord("おれんじ"), {
    success: false,
    reason: "ValidationError",
    error: "IllegalFirstCharacter",
  });
  assertEquals(s.previousWord, "しりとり");
  assertEquals(s.setOfPreviousWords, new Set(["しりとり"]));
});

Deno.test("chain a word ending in 'ん'", () => {
  const s = new Shiritori("しりとり");
  assertEquals(s.chainNextWord("りん"), { success: true, becomeInActive: true });
  assertEquals(s.previousWord, "りん");
  assertEquals(s.setOfPreviousWords, new Set(["しりとり", "りん"]));
});

Deno.test("chain a word ending in 'ん'", () => {
  const g = new ShiritoriGame("しりとり");
  assertEquals(g.chainNextWord("りん"), { success: true, becomeInActive: true });
  assertEquals(g.chainNextWord("ん"), { success: false, reason: "InActive" });
});
