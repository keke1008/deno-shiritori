import React from "react";

interface Props {
  isGameActive: boolean;
}

export const GameStatus: React.FC<Props> = ({ isGameActive }) => {
  if (isGameActive) {
    return null;
  }

  const fontSize = "clamp(100%, 5vw, 50px)";

  return (
    <div className="w-full flex justify-center m-5">
      <div style={{ fontSize }}>
        ゲームが終了しました
      </div>
    </div>
  );
};
