import { acceptSSE } from "~/src/game.ts";

export const GET = (_: Request) => {
  return acceptSSE();
};
