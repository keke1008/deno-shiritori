import {
  ErrorResponseBody,
  RequestBody,
} from "~/routes/game/chain-next-word.ts";
import { GameStatus } from "~/routes/game/status.ts";

const GAME_STATUS_ENDPOINT = "/game/status";
const CHAIN_WORD_ENDPOINT = "/game/chain-next-word";

export type ChainNextWordResult =
  | { success: true }
  | { success: false; reason: string };

/** サーバに問い合わせを行う関数群を提供する */
export const useFetchShiritori = () => {
  return {
    /** 現在のゲームの状態を取得する */
    getGameStatus: async (): Promise<GameStatus> => {
      const response = await fetch(GAME_STATUS_ENDPOINT);
      return response.json() as Promise<GameStatus>;
    },

    /** 次の単語をサーバーに送信する */
    chainNextWord: async (nextWord: string): Promise<ChainNextWordResult> => {
      const body: RequestBody = { nextWord };

      const response = await fetch(CHAIN_WORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status === 400) {
        const body: ErrorResponseBody = await response.json();
        return { success: false, reason: body.message };
      }

      return { success: true };
    },
  };
};
