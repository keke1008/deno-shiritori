import { assert } from "std/testing/asserts.ts";

export type ValidationError =
  | "ZeroLengthString"
  | "UsedWord"
  | "IllegalFirstCharacter"
  | "ContainsNonHiraganaCharacter";

export type ValidationResult =
  | { isValid: true }
  | { isValid: false; error: ValidationError };

export type ChainResult =
  | { success: true; becomeInActive: boolean }
  | { success: false; reason: "InActive" }
  | { success: false; reason: "ValidationError"; error: ValidationError };

/** 与えられた文字列の最後の文字を返す */
const lastChar = (str: string): string => {
  return str.charAt(str.length - 1);
};

export class Shiritori {
  previousWord: string;
  setOfPreviousWords = new Set<string>();

  static staticValidation(word: string): ValidationResult {
    if (word.length == 0) {
      return { isValid: false, error: "ZeroLengthString" };
    }
    if (!word.match(/^[\u3041-\u309fー]+$/)) { // ひらがな以外の文字を含む場合
      return { isValid: false, error: "ContainsNonHiraganaCharacter" };
    }
    return { isValid: true };
  }

  constructor(initialWord: string) {
    assert(Shiritori.staticValidation(initialWord).isValid);
    this.previousWord = initialWord;
    this.setOfPreviousWords.add(initialWord);
  }

  validateNextWord(nextWord: string): ValidationResult {
    const result = Shiritori.staticValidation(nextWord);
    if (!result.isValid) {
      return result;
    }
    if (this.setOfPreviousWords.has(nextWord)) {
      return { isValid: false, error: "UsedWord" };
    }
    if (lastChar(this.previousWord) !== nextWord.charAt(0)) {
      return { isValid: false, error: "IllegalFirstCharacter" };
    }
    return { isValid: true };
  }

  chainNextWord(nextWord: string): ChainResult {
    const result = this.validateNextWord(nextWord);

    if (!result.isValid) {
      return { success: false, reason: "ValidationError", error: result.error };
    }

    this.previousWord = nextWord;
    this.setOfPreviousWords.add(this.previousWord);

    return {
      success: true,
      becomeInActive: lastChar(this.previousWord) === "ん",
    };
  }

  getPreviousWord(): string {
    return this.previousWord;
  }
}

export class ShiritoriGame {
  shiritori: Shiritori;
  isActive = true;

  constructor(initialWord: string) {
    this.shiritori = new Shiritori(initialWord);
  }

  chainNextWord(nextWord: string): ChainResult {
    if (!this.isActive) {
      return { success: false, reason: "InActive" };
    }

    const result = this.shiritori.chainNextWord(nextWord);
    if (result.success && result.becomeInActive) {
      this.isActive = false;
    }

    return result;
  }

  getPreviousWord(): string {
    return this.shiritori.getPreviousWord();
  }

  isGameActive(): boolean {
    return this.isActive;
  }
}

const globalShiritori = new ShiritoriGame("しりとり");

export const ChainNextWord = (nextWord: string): ChainResult => {
  return globalShiritori.chainNextWord(nextWord);
};

export const getPreviousWord = (): string => {
  return globalShiritori.getPreviousWord();
};

export const isGameActive = (): boolean => {
  return globalShiritori.isGameActive();
};
