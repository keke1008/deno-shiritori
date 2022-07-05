import { useEffect, useRef, useState } from "react";
import type { GetResponse, PostResponse } from "~/routes/shiritori.ts";
import type { SSEEventType } from "~/src/game.ts";

const SHIRITORI_API_URL = "/shiritori";
const WATCH_ENDPOINT = "/watch";

type PostResult = { status: "success" } | { status: "failure"; reason: string };

/** SSEのイベントを型セーフにlistenする */
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

/**
 * しりとりの操作をサーバーとやり取りする
 */
export const useShiritori = (): {
  /** しりとりの前の単語 */
  previousWord: string;

  /**
   * しりとりの次の単語をサーバーに送信する
   *
   * @param nextWord - 送信される単語
   * @returns - 送信した結果．しりとりの次の単語としてふさわしくない場合，`.status === failure`となる
   */
  postNextWord: (nextWord: string) => Promise<PostResult>;

  /***
   * しりとりゲームが終了していないかどうか
   */
  isGameActive: boolean;
} => {
  const eventSource = useRef<EventSource>();
  const [previousWord, setPreviousWord] = useState<string>("");
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  // サーバーから前の単語を取得する
  useEffect(() => {
    fetch(SHIRITORI_API_URL)
      .then((response) => response.json() as Promise<GetResponse>)
      .then(({ previousWord, isGameActive }) => {
        setPreviousWord(previousWord);
        setIsGameActive(isGameActive);
      });
  }, []);

  // サーバーから送られてくる各種イベントを監視する
  useEffect(() => {
    eventSource.current = new EventSource(WATCH_ENDPOINT);

    listen(eventSource.current, "chainWord", ({ word }) => {
      setPreviousWord(word);
    });

    listen(eventSource.current, "gameOver", () => {
      setIsGameActive(false);
    });

    return () => eventSource.current!.close();
  }, []);

  const postNextWord = async (nextWord: string): Promise<PostResult> => {
    const response = await fetch(SHIRITORI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextWord }),
    });

    const json = await response.json() as PostResponse;
    if (!json.success) {
      return { status: "failure", reason: json.reason };
    }

    setPreviousWord(json.previousWord);
    setIsGameActive(json.isGameActive);
    return { status: "success" };
  };

  return { previousWord, postNextWord, isGameActive };
};
