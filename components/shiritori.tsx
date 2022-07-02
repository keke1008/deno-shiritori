import React, { useRef, useState } from "react";
import { useShiritori } from "~/hooks/shiritori.ts";
import {
  WordInputBox,
  WordInputBoxHandler,
} from "~/components/WordInputBox.tsx";

export const Shiritori: React.FC = () => {
  const { previousWord, postNextWord, isGameActive } = useShiritori();
  const [seinding, setSending] = useState(false);

  const nextWord = useRef<WordInputBoxHandler>(null!);
  const postWord = async () => {
    setSending(true);
    const result = await postNextWord(nextWord.current.value);

    if (result.status === "failure") {
      alert(result.reason);
    }
    setSending(false);
  };

  return (
    <>
      <h1>しりとり</h1>
      {isGameActive || "ゲームが終了しました"}
      <p>前の単語: {previousWord}</p>
      <WordInputBox
        ref={nextWord}
        onConfirm={postWord}
        disabled={!isGameActive || seinding}
      />
    </>
  );
};
