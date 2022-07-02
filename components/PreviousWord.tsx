import React from "react";
import { Icon } from "@iconfy/react";

interface Props {
  previousWord: string;
}

export const PreviousWord: React.FC<Props> = ({ previousWord }) => {
  const fontSize = "clamp(100%, 5vw, 50px)";
  const lastIndex = previousWord.length - 1;

  return (
    <div className="w-full">
      <div
        className="flex w-4/5 max-w-3xl m-auto p-10 font-bold text-gray-700"
        style={{ fontSize }}
      >
        <div>
          {previousWord.slice(0, lastIndex)}
          <span className="text-green-500">{previousWord[lastIndex]}</span>
        </div>
        <Icon
          icon="fontisto:angle-dobule-right"
          fontSize={fontSize}
          className="h-auto"
        />
      </div>
    </div>
  );
};

