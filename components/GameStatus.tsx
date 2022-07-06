import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface Props {
  isGameActive: boolean;
  resetGame: () => void;
}

export const GameStatus: React.FC<Props> = ({ isGameActive, resetGame }) => {
  if (isGameActive) {
    return null;
  }
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex flex-col items-center m-4">
      <div className="text-2xl">ゲームが終了しました</div>
      <button
        className={`
            flex border-none rounded-full aspect-square h-full 
            ${pressed ? "bg-green-600" : "bg-green-500 shadow-md"}`}
        onClick={() => resetGame()}
        onMouseDown={() => setPressed(true)}
        onMouseLeave={() => setPressed(false)}
        onMouseUp={() => setPressed(false)}
      >
        <Icon
          icon="ant-design:reload-outlined"
          className="text-white text-3xl self-center"
        />
      </button>
    </div>
  );
};
