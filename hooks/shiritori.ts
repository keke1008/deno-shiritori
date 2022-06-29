import { useEffect, useState } from "react";

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
} => {
  const [previousWord, setPreviousWord] = useState<string>("");

  // サーバーから前の単語を取得する
  useEffect(() => {
    fetch(SHIRITORI_API_URL)
      .then((response) => response.text())
      .then(setPreviousWord);
  }, []);

  const postNextWord = async (nextWord: string): Promise<PostResult> => {
    const response = await fetch(SHIRITORI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextWord }),
    });

    const text = await response.text();
    if (response.status !== 200) {
      return { status: "failure", reason: text };
    }

    setPreviousWord(text);
    return { status: "success" };
  };

  return { previousWord, postNextWord };
};
