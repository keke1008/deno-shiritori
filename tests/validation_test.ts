import { validate, validationChain } from "~/src/validation.ts";
import { assertEquals } from "std/testing/asserts.ts";

const {
  wordLength,
  usedWord,
  nonHiraganaCharacter,
  firstCharacter,
  lastCharacter,
} = validate;

Deno.test("validate a word that has illegal first character", () => {
  assertEquals(
    firstCharacter("すいか", "しりとり"),
    { isValid: false, error: "IllegalFirstCharacter" },
  );
});

Deno.test("validate a word that has correct first character", () => {
  assertEquals(
    firstCharacter("りんご", "しりとり"),
    { isValid: true },
  );
});

Deno.test("validate a word ending in 'ん'", () => {
  assertEquals(
    lastCharacter("みかん"),
    { isValid: false, error: "IllegalLastCharacter" },
  );
});

Deno.test("validate a word not ending in 'ん'", () => {
  assertEquals(
    lastCharacter("りんご"),
    { isValid: true },
  );
});

Deno.test("validate a word that contains non-hiragana character", () => {
  assertEquals(
    nonHiraganaCharacter("apple"),
    { isValid: false, error: "ContainsNonHiraganaCharacter" },
  );
});

Deno.test("validate a word that contains only hiragana", () => {
  assertEquals(
    nonHiraganaCharacter("りんご"),
    { isValid: true },
  );
});

Deno.test("validate a used word", () => {
  assertEquals(
    usedWord("りんご", (word) => word === "りんご"),
    { isValid: false, error: "UsedWord" },
  );
});

Deno.test("validate a unused word", () => {
  assertEquals(
    usedWord("りんご", () => false),
    { isValid: true },
  );
});

Deno.test("validate a zero length word", () => {
  assertEquals(
    wordLength(""),
    { isValid: false, error: "ZeroLengthString" },
  );
});

Deno.test("validate a non zero length word", () => {
  assertEquals(
    wordLength("りんご"),
    { isValid: true },
  );
});

Deno.test("successful multiple validation", () => {
  const result = validationChain("りんご")
    .or(firstCharacter, "しりとり")
    .or(nonHiraganaCharacter)
    .or(usedWord, () => false)
    .or(wordLength)
    .result();

  assertEquals(
    result,
    { isValid: true },
  );
});

Deno.test("successful multiple validation", () => {
  const result = validationChain("りんご")
    .or(firstCharacter, "しりとり")
    .or(lastCharacter)
    .or(nonHiraganaCharacter)
    .or(usedWord, () => false)
    .or(wordLength)
    .result();

  assertEquals(
    result,
    { isValid: true },
  );
});

Deno.test("failing multiple validation", () => {
  const result = validationChain("りa")
    .or(firstCharacter, "しりとり")
    .or(lastCharacter)
    .or(nonHiraganaCharacter)
    .or(usedWord, () => false)
    .or(wordLength)
    .result();

  assertEquals(
    result,
    { isValid: false, error: "ContainsNonHiraganaCharacter" },
  );
});
