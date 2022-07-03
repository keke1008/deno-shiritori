export type { ValidationError } from "~/src/shiritori.ts";
import { ChainResult, ShiritoriGame } from "~/src/shiritori.ts";
import { getRandomWord } from "~/src/randomWord.ts";

const globalShiritori = new ShiritoriGame(getRandomWord());

export const ChainNextWord = (nextWord: string): ChainResult => {
  return globalShiritori.chainNextWord(nextWord);
};

export const getPreviousWord = (): string => {
  return globalShiritori.getPreviousWord();
};

export const isGameActive = (): boolean => {
  return globalShiritori.isGameActive();
};

