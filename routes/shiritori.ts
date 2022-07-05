import { ChainNextWord, getPreviousWord, ValidationError } from "~/src/game.ts";

export type GetResponse = { previousWord: string };

export const GET = (_req: Request) => {
  return new Response(getPreviousWord());
};

export const POST = async (req: Request) => {
  const requestJson = await req.json() as { nextWord: string };
  const nextWord = requestJson.nextWord;

  const result = ChainNextWord(nextWord);
  if (result.success) {
    return new Response(nextWord);
  }

  if (result.reason == "InActive") {
    return new Response("ゲームは既に終了しています");
  }

  const reasonToMessageMap: { [key in ValidationError]: string } = {
    "IllegalFirstCharacter": "前の単語に続いていません",
    "ZeroLengthString": "単語が入力されていません",
    "UsedWord": "既に使用された単語です",
    "ContainsNonHiraganaCharacter": "単語はひらがなのみで入力してください",
  };
  return new Response(reasonToMessageMap[result.error]);
};
