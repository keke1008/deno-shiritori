import { getPreviousWord, isGameActive } from "~/src/game.ts";

/** 現在のゲームの状態を表す */
export interface GameStatus {
  /** 前の単語 */
  previousWord: string;

  /** ゲームが続いているか */
  isGameActive: boolean;
}

export const GET = () => {
  const responseData: GameStatus = {
    previousWord: getPreviousWord(),
    isGameActive: isGameActive(),
  };

  return new Response(JSON.stringify(responseData));
};
