import { useEffect, useState } from "react";
import type { GetResponse, PostResponse } from "~/routes/shiritori.ts";

const SHIRITORI_API_URL = "/shiritori";

type PostResult = { status: "success" } | { status: "failure"; reason: string };

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
