import { getCookies } from "std/http/cookie.ts";
import { COOKIE_PLAYER_ID_KEY } from "~/middlewares/player.ts";

export interface PlayerId {
  playerId: string;
}

export const GET = (request: Request) => {
  const responseData: PlayerId = {
    playerId: getCookies(request.headers)[COOKIE_PLAYER_ID_KEY],
  };
  return new Response(JSON.stringify(responseData));
};
