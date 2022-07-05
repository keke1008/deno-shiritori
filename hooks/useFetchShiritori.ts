import { GetResponse, PostResponse } from "~/routes/shiritori.ts";

const GAME_STATUS_ENDPOINT = "/shiritori";
const CHAIN_WORD_ENDPOINT = "/shiritori";

/** サーバに問い合わせを行う関数群を提供する */
export const useFetchShiritori = () => {
  return {
    /** 現在のゲームの状態を取得する */
    getGameStatus: async (): Promise<GetResponse> => {
      const response = await fetch(GAME_STATUS_ENDPOINT);
      return response.json() as Promise<GetResponse>;
    },

    /** 次の単語をサーバーに送信する */
    chainNextWord: async (nextWord: string): Promise<PostResponse> => {
      const response = await fetch(CHAIN_WORD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextWord }),
      });

      return response.json() as Promise<PostResponse>;
    },
  };
};
