import type { SSEEventType } from "~/src/game.ts";
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
  const [history, setHistory] = useState<string[]>([]);

  // 現在のゲームの状態をstateに反映する
  useEffect(() => {
    getGameStatus().then(({ previousWord, isGameActive }) => {
      setPreviousWord(previousWord);
      setIsGameActive(isGameActive);
    });

    getHistory().then(({ history }) => {
      setHistory(history);
    });
  }, []);

  // サーバーから送られてくる各種イベントを監視する
  useEffect(() => {
    source.current = new EventSource(WATCH_ENDPOINT);

    listen(source.current, "chainWord", ({ word }) => {
      setPreviousWord(word);
      setHistory((history) => [...history, word]);
    });

    listen(source.current, "gameOver", () => {
      setIsGameActive(false);
    });

    listen(source.current, "resetGame", ({ initialWord }) => {
      setPreviousWord(initialWord);
      setHistory([initialWord]);
      setIsGameActive(true);
    });

    return () => source.current!.close();
  }, []);

  return { isGameActive, previousWord, history };
};
