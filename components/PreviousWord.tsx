import React from "react";
import { Icon } from "@iconify/react";

interface Props {
  previousWord: string;
}

export const PreviousWord: React.FC<Props> = ({ previousWord }) => {
  const lastIndex = previousWord.length - 1;

  return (
    <div className="flex w-full py-10 font-bold text-gray-700 text-3xl">
      <div>
        {previousWord.slice(0, lastIndex)}
        <span className="text-green-500">{previousWord[lastIndex]}</span>
      </div>
      <Icon
        icon="clarity:angle-double-line"
        rotate={1}
        className="h-auto text-gray-700 text-3xl"
      />
    </div>
  );
};
