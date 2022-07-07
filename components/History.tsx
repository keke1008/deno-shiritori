import React from "react";
import { WordUpdate } from "~/src/game.ts";

export interface Props {
  history: readonly WordUpdate[];
}

export const History: React.FC<Props> = ({ history }) => {
  return (
    <div className="h-full">
      <div
        className="m-4 overflow-y-scroll hide-scrollbar"
        style={{ height: "calc(100% - 2rem)" }}
      >
        {[...history].reverse().map(({ word }) => {
          return (
            <div
              key={word}
              className="m-1 p-2 items-center rounded-md bg-green-200 text-center"
              style={{ width: "calc(100% - 3rem)" }}
            >
              <div>{word}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
