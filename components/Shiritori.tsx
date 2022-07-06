import React, { useRef } from "react";
import { useFetchShiritori } from "~/hooks/useFetchShiritori.ts";
import { useWatchShiritori } from "~/hooks/useWatchShiritori.ts";
import { useLoading } from "~/hooks/useLoading.ts";

import { History } from "~/components/History.tsx";
import { PlayerRanking } from "~/components/PlayerRanking.tsx";

import {
  WordInputBox,
  WordInputBoxHandler,
} from "~/components/WordInputBox.tsx";
import { PreviousWord } from "~/components/PreviousWord.tsx";
import { GameStatus } from "~/components/GameStatus.tsx";

export const Shiritori: React.FC = () => {
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
    <div className="w-full flex justify-center h-full">
      <History history={history} />
      <div>
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
      <PlayerRanking updateStats={updateStats} />
    </div>
  );
};
