import { ChainResult, ShiritoriGame } from "~/src/shiritori.ts";
import { getRandomWord } from "~/src/randomWord.ts";
import { SSE } from "~/src/SSE.ts";

export type { ChainError, ChainResult } from "~/src/shiritori.ts";

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

/** ゲームがリセットした */
export interface ResetGame {
  event: "resetGame";
  data: { initialWord: string };
}

/** SSEで受信するイベントの種類 */
export type SSEEventType = ChainWord | GameOver | ResetGame;

const globalSSE = new SSE<SSEEventType>();

export const chainNextWord = (nextWord: string): ChainResult => {
  const result = globalShiritori.chainNextWord(nextWord);
  if (result.success) {
    globalSSE.send({ event: "chainWord", data: { word: nextWord } });

    if (result.gameOver) {
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

export const resetGame = () => {
  globalShiritori.reset(getRandomWord());
  globalSSE.send({
    event: "resetGame",
    data: { initialWord: getPreviousWord() },
  });
};

export const getHistory = () => {
  return globalShiritori.getHistory();
};
