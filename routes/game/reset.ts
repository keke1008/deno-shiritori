import { resetGame } from "~/src/game.ts";

export const POST = () => {
  resetGame();
  return new Response();
};
