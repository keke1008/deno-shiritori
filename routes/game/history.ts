import { getHistory } from "~/src/game.ts";

type UnReadOnly<T> = { -readonly [P in keyof T]: UnReadOnly<T[P]> };

/** これまでのゲームの履歴 */
interface StrictHistory {
  /** 更新されてきた単語のリスト */
  history: readonly string[];
}

export type History = UnReadOnly<StrictHistory>;

export const GET = () => {
  const responseData: StrictHistory = {
    history: getHistory(),
  };
  return new Response(JSON.stringify(responseData));
};
