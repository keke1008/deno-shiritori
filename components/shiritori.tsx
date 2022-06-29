import React, { useRef } from "react";
import { useShiritori } from "~/hooks/shiritori.ts";

export const Shiritori: React.FC = () => {
  const { previousWord, postNextWord, isGameActive } = useShiritori();

  const nextWord = useRef<HTMLInputElement>(null!);
  const handleClick = async () => {
    const result = await postNextWord(nextWord.current.value);

    if (result.status === "failure") {
      alert(result.reason);
    }
  };

  return (
    <>
      <h1>しりとり</h1>
      {isGameActive || "ゲームが終了しました"}
      <p>前の単語: {previousWord}</p>
      <input ref={nextWord} type="text" disabled={!isGameActive} />
      <button onClick={handleClick} disabled={!isGameActive}>送信</button>
    </>
  );
};
