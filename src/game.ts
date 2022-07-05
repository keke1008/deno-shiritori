export type { ValidationError } from "~/src/shiritori.ts";
import { ChainResult, ShiritoriGame } from "~/src/shiritori.ts";
import { getRandomWord } from "~/src/randomWord.ts";
import { SSE } from "~/src/SSE.ts";

const globalShiritori = new ShiritoriGame(getRandomWord());

/** しりとりの単語が更新された */
export interface ChainWord {
  event: "chainWord";
  data: { word: string };
}

/** ゲームが終了した */
export interface GameOver {
  event: "gameOver";
}

/** SSEで受信するイベントの種類 */
export type SSEEventType = ChainWord | GameOver;

const globalSSE = new SSE<SSEEventType>();

export const chainNextWord = (nextWord: string): ChainResult => {
  const result = globalShiritori.chainNextWord(nextWord);
  if (result.success) {
    globalSSE.send({ event: "chainWord", data: { word: nextWord } });

    if (result.becomeInActive) {
      globalSSE.send({ event: "gameOver" });
    }
  }
  return result;
};

export const getPreviousWord = (): string => {
  return globalShiritori.getPreviousWord();
};

export const isGameActive = (): boolean => {
  return globalShiritori.isGameActive();
};

export const acceptSSE = (): Response => {
  return globalSSE.accept();
};
