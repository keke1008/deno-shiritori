import { Shiritori, ShiritoriGame } from "~/src/shiritori.ts";
import {
  assertEquals,
  AssertionError,
  assertThrows,
} from "std/testing/asserts.ts";

Deno.test("construct with a word that fail in staticValidation", () => {
  assertThrows(() => new Shiritori(""), AssertionError);
});

Deno.test("chain unused word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(
    s.chainNextWord("りんご"),
    { success: true, gameOver: false },
  );
  assertEquals(s.previousWord, "りんご");
  assertEquals(s.usedWords, new Set(["しりとり", "りんご"]));
});

Deno.test("chain illegal word", () => {
  const s = new Shiritori("しりとり");
  assertEquals(s.chainNextWord("おれんじ"), {
    success: false,
    reason: "ValidationError",
    error: "IllegalFirstCharacter",
  });
  assertEquals(s.previousWord, "しりとり");
  assertEquals(s.usedWords, new Set(["しりとり"]));
});

Deno.test("chain a word ending in 'ん'", () => {
  const s = new Shiritori("しりとり");
  assertEquals(s.chainNextWord("りん"), { success: true, gameOver: true });
  assertEquals(s.previousWord, "りん");
  assertEquals(s.usedWords, new Set(["しりとり", "りん"]));
});

Deno.test("chain a word ending in 'ん'", () => {
  const g = new ShiritoriGame("しりとり");
  assertEquals(g.chainNextWord("りん"), { success: true, gameOver: true });
  assertEquals(g.chainNextWord("ん"), { success: false, reason: "InActive" });
});
