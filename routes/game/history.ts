import { getHistory, WordUpdateHistory } from "~/src/game.ts";

/** これまでのゲームの履歴 */
export interface History {
  /** 更新されてきた単語のリスト */
  history: WordUpdateHistory;
}

export const GET = () => {
  const responseData: History = {
    history: getHistory(),
  };
  return new Response(JSON.stringify(responseData));
};
