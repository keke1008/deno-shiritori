import React, { useRef } from "react";

import { useFetchShiritori } from "~/hooks/useFetchShiritori.ts";
import { useWatchShiritori } from "~/hooks/useWatchShiritori.ts";
import { useLoading } from "~/hooks/useLoading.ts";

import { History } from "~/components/History.tsx";
import { PlayerRanking } from "~/components/PlayerRanking.tsx";
import { Header } from "~/components/Header.tsx";
import {
  WordInputBox,
  WordInputBoxHandler,
} from "~/components/WordInputBox.tsx";
import { PreviousWord } from "~/components/PreviousWord.tsx";
import { GameStatus } from "~/components/GameStatus.tsx";

export const Page: React.FC = () => {
  const {
    previousWord,
    isGameActive,
    history,
    updateStats,
  } = useWatchShiritori();
  const { chainNextWord: _chainNextWord, resetGame } = useFetchShiritori();
  const [chainNextWord, loading] = useLoading(_chainNextWord);

  const nextWord = useRef<WordInputBoxHandler>(null!);

  const postWord = async () => {
    const result = await chainNextWord(nextWord.current.value);

    if (result.success) {
      nextWord.current.clear();
    } else {
      alert(result.reason);
    }
  };

  const reset = async () => {
    await resetGame();
    nextWord.current.clear();
    nextWord.current.focus();
  };
  return (
    <div
      className="grid grid-rows-2 grid-cols-3 h-screen w-screen bg-green-100"
      style={{
        gridTemplateRows: "8vh 92vh",
        gridTemplateColumns: "30vw 40vw 30vw",
      }}
    >
      <header className="col-span-full">
        <Header />
      </header>

      <section>
        <History history={history} />
      </section>

      <section className="h-full bg-white">
        <div className="m-4">
          <PreviousWord previousWord={previousWord} />
          <WordInputBox
            ref={nextWord}
            onConfirm={postWord}
            disabled={!isGameActive || loading}
          />
          <GameStatus
            isGameActive={isGameActive}
            resetGame={reset}
          />
        </div>
      </section>

      <section>
        <PlayerRanking updateStats={updateStats} />
      </section>
    </div>
  );
};
