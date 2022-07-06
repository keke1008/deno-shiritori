import React, { useEffect, useRef } from "react";
import { useFetchShiritori } from "~/hooks/useFetchShiritori.ts";

export interface Props {
  updateStats: Record<string, number>;
}

export const PlayerRanking: React.FC<Props> = ({ updateStats }) => {
  const selfId = useRef("");
  const { getPlayerId } = useFetchShiritori();

  useEffect(() => {
    getPlayerId().then((id) => selfId.current = id);
  }, []);

  const ranking = Object.entries(updateStats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="h-full">
      <div
        className="m-4 overflow-y-scroll"
        style={{ width: "calc(100% - 2rem)" }}
      >
        {ranking.map(([playerId, count]) => {
          const isSelf = playerId === selfId.current;

          const inner = (
            <>
              <div>{isSelf ? "YOU" : playerId.substring(0, 5)}</div>
              <div>{count}</div>
            </>
          );

          if (isSelf) {
            return (
              <div
                key={playerId}
                className="flex flex-col items-center rounded-md m-1 p-2 text-red-600 border-solid"
              >
                {inner}
              </div>
            );
          }

          const bg = `hsl(${parseInt(playerId.slice(0, 8), 16)}, 100%, 90%)`;
          return (
            <div
              key={playerId}
              style={{ backgroundColor: bg }}
              className="flex flex-col items-center rounded-md m-1 p-2"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
};
