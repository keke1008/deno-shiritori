import {
  ErrorResponseBody,
  RequestBody,
} from "~/routes/game/chain-next-word.ts";
import { GameStatus } from "~/routes/game/status.ts";
import { History } from "~/routes/game/history.ts";
import { PlayerId } from "~/routes/game/player.ts";

const GAME_STATUS_ENDPOINT = "/game/status";
const GAME_RESET_ENDPOINT = "/game/reset";
const CHAIN_WORD_ENDPOINT = "/game/chain-next-word";
const HISTORY_ENDPOINT = "/game/history";
const PLAYER_ID_ENDPOINT = "/game/player";

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

    /** 現在のゲームをリセットする */
    resetGame: async (): Promise<void> => {
      await fetch(GAME_RESET_ENDPOINT, { method: "POST" });
    },

    /** 現在のゲームの履歴を取得する */
    getHistory: async (): Promise<History> => {
      const response = await fetch(HISTORY_ENDPOINT);
      return response.json() as Promise<History>;
    },

    /** プレイヤーのid を取得する */
    getPlayerId: async (): Promise<string> => {
      console.log(PLAYER_ID_ENDPOINT);
      const response = await fetch(PLAYER_ID_ENDPOINT);
      return (await response.json() as PlayerId).playerId;
    },
  };
};
