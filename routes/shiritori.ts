import { ChainError, chainNextWord, getPreviousWord } from "~/src/game.ts";
import { COOKIE_PLAYER_ID_KEY } from "~/middlewares/player.ts";
import { getCookies } from "std/http/cookie.ts";

export type GetResponse = { previousWord: string };

export const GET = (_req: Request) => {
  return new Response(getPreviousWord());
};

export const POST = async (req: Request) => {
  const requestJson = await req.json() as { nextWord: string };
  const nextWord = requestJson.nextWord;

  const playerId = getCookies(req.headers)[COOKIE_PLAYER_ID_KEY];
  const result = chainNextWord(nextWord, playerId);
  if (result.success) {
    return new Response(nextWord);
  }

  if (result.reason == "InActive") {
    return new Response("ゲームは既に終了しています");
  }

  const reasonToMessageMap: { [key in ChainError]: string } = {
    "IllegalFirstCharacter": "前の単語に続いていません",
    "ZeroLengthString": "単語が入力されていません",
    "UsedWord": "既に使用された単語です",
    "ContainsNonHiraganaCharacter": "単語はひらがなのみで入力してください",
  };
  return new Response(reasonToMessageMap[result.error]);
};
