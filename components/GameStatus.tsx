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

  const fontSize = "clamp(100%, 5vw, 50px)";

  return (
    <div className="w-full flex justify-center m-5">
      <div style={{ fontSize }}>
        ゲームが終了しました
      </div>
      <button
        className={`
            border-none flex items-center justify-center m-auto
            rounded-full aspect-square h-full 
            ${pressed ? "bg-green-600" : "bg-green-500 shadow-md"}`}
        onClick={() => resetGame()}
        onMouseDown={() => setPressed(true)}
        onMouseLeave={() => setPressed(false)}
        onMouseUp={() => setPressed(false)}
      >
        <Icon
          icon="ant-design:reload-outlined"
          fontSize={fontSize}
          className="text-white"
        />
      </button>
    </div>
  );
};
