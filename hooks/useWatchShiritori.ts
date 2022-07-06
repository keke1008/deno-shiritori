import type { SSEEventType, WordUpdateHistory } from "~/src/game.ts";
import { useEffect, useRef, useState } from "react";
import { useFetchShiritori } from "~/hooks/useFetchShiritori.ts";

const WATCH_ENDPOINT = "/watch";

/** SSEのイベントを型セーフにlistenする関数 */
const listen = <
  E extends SSEEventType["event"],
  D = Extract<SSEEventType, { event: E }> extends { data: infer D } ? D : never,
>(
  source: EventSource,
  event: E,
  callback: D[] extends never[] ? () => void : (data: D) => void,
) => {
  source.addEventListener(event, (e) => {
    const data = JSON.parse(e.data) as D;
    callback(data);
  });
};

/** サーバーから送られてくるデータをstateで管理する */
export const useWatchShiritori = () => {
  const { getGameStatus, getHistory } = useFetchShiritori();

  const source = useRef<EventSource>();
  const [previousWord, setPreviousWord] = useState<string>("");
  const [isGameActive, setIsGameActive] = useState<boolean>(true);
  const [history, setHistory] = useState<WordUpdateHistory | []>([]);
  const [updateStats, setUpdateStats] = useState<Record<string, number>>({});

  // 現在のゲームの状態をstateに反映する
  useEffect(() => {
    getGameStatus().then(({ previousWord, isGameActive }) => {
      setPreviousWord(previousWord);
      setIsGameActive(isGameActive);
    });

    getHistory().then(({ history }) => {
      setHistory(history);

      const [_, ...history_] = history;
      const stats: Record<string, number> = {};
      for (const { playerId } of history_) {
        stats[playerId] = (stats[playerId] ?? 0) + 1;
      }
      setUpdateStats(stats);
    });
  }, []);

  // サーバーから送られてくる各種イベントを監視する
  useEffect(() => {
    source.current = new EventSource(WATCH_ENDPOINT);

    listen(source.current, "chainWord", (update) => {
      const { word, playerId } = update;
      setPreviousWord(word);
      setHistory((history) => [...history, update]);

      setUpdateStats((stats) => {
        const next = (stats[playerId] ?? 0) + 1;
        return { ...stats, [playerId]: next };
      });
    });

    listen(source.current, "gameOver", () => {
      setIsGameActive(false);
    });

    listen(source.current, "resetGame", ({ initialWord }) => {
      setPreviousWord(initialWord);
      setHistory([{ word: initialWord }]);
      setUpdateStats({});
      setIsGameActive(true);
    });

    return () => source.current!.close();
  }, []);

  return { isGameActive, previousWord, history, updateStats };
};
