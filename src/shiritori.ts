import { assert } from "std/testing/asserts.ts";
import { validate, validationChain } from "~/src/validation.ts";

export type ChainError =
  | "ZeroLengthString"
  | "UsedWord"
  | "IllegalFirstCharacter"
  | "ContainsNonHiraganaCharacter";

export type ChainResult =
  | { success: true; gameOver: boolean }
  | { success: false; reason: "InActive" }
  | {
    success: false;
    reason: "ValidationError";
    error: ChainError;
  };

/** しりとりの「言葉をつなげていく」部分の責務を負うクラス */
export class Shiritori {
  previousWord: string;
  usedWords = new Set<string>();

  constructor(initialWord: string) {
    const result = validationChain(initialWord)
      .or(validate.wordLength)
      .or(validate.nonHiraganaCharacter)
      .or(validate.lastCharacter)
      .result();
    assert(result.isValid);

    this.previousWord = initialWord;
    this.usedWords.add(initialWord);
  }

  chainNextWord(
    nextWord: string,
  ): ChainResult {
    const result = validationChain(nextWord)
      .or(validate.wordLength)
      .or(validate.nonHiraganaCharacter)
      .or(validate.usedWord, (word: string) => this.usedWords.has(word))
      .or(validate.firstCharacter, this.previousWord)
      .result();

    if (!result.isValid) {
      return { success: false, reason: "ValidationError", error: result.error };
    }

    this.previousWord = nextWord;
    this.usedWords.add(this.previousWord);

    return {
      success: true,
      gameOver: !validate.lastCharacter(nextWord).isValid,
    };
  }

  getPreviousWord(): string {
    return this.previousWord;
  }
}

export interface WordUpdate {
  word: string;
  playerId?: string;
}

export type WordUpdateHistory =
  | [WordUpdate, ...Required<WordUpdate>[]]
  | [WordUpdate];

/** しりとりをゲームとして動かす */
export class ShiritoriGame {
  shiritori: Shiritori;
  history: WordUpdateHistory;
  isActive = true;

  constructor(initialWord: string) {
    this.shiritori = new Shiritori(initialWord);
    this.history = [{ word: initialWord }];
  }

  chainNextWord(nextWord: string, playerId: string): ChainResult {
    if (!this.isActive) {
      return { success: false, reason: "InActive" };
    }

    const result = this.shiritori.chainNextWord(nextWord);
    if (!result.success) {
      return result;
    }
    if (result.gameOver) {
      this.isActive = false;
    }
    this.history.push({ word: nextWord, playerId });

    return result;
  }

  getPreviousWord(): string {
    return this.shiritori.getPreviousWord();
  }

  isGameActive(): boolean {
    return this.isActive;
  }

  reset(initialWord: string) {
    this.shiritori = new Shiritori(initialWord);
    this.history = [{ word: initialWord }];
    this.isActive = true;
  }

  getHistory(): WordUpdateHistory {
    return this.history;
  }
}
