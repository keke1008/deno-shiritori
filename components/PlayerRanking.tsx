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
    <div className="flex-1 h-full">
      <div className="m-10 p-4 h-full">
        {ranking.map(([playerId, count]) => {
          const isSelf = playerId === selfId.current;
          const bg = `hsl(${parseInt(playerId.slice(0, 8), 16)}, 100%, 90%)`;
          if (isSelf) {
            return (
              <div
                key={playerId}
                className="flex flex-col items-center rounded-md text-red-600 border-solid my-4 p-4"
              >
                <div>{isSelf ? "YOU" : playerId.substring(0, 5)}</div>
                <div>{count}</div>
              </div>
            );
          }
          return (
            <div
              key={playerId}
              style={isSelf ? {} : { backgroundColor: bg }}
              className="flex flex-col items-center rounded-md text-black my-4 p-4"
            >
              <div>{isSelf ? "self" : playerId.substring(0, 5)}</div>
              <div>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
