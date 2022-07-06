import React from "react";
import { WordUpdate } from "~/src/game.ts";

export interface Props {
  history: readonly WordUpdate[];
}

export const History: React.FC<Props> = ({ history }) => {
  return (
    <div className="flex-1 h-full">
      <div className="m-10 p-4 bg-green-200 h-full">
        {history.map(({ word }, i) => {
          return (
            <div key={word} className="w-full text-medium">
              {`${i + 1}: ${word}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};
