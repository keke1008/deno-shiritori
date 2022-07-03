import {
  ChainNextWord,
  getPreviousWord,
  isGameActive,
  ValidationError,
} from "~/src/game.ts";

export type GetResponse = { previousWord: string; isGameActive: boolean };

export const GET = (_req: Request) => {
  return new Response(
    JSON.stringify({
      previousWord: getPreviousWord(),
      isGameActive: isGameActive(),
    }),
  );
};

export type PostResponse =
  | { success: true; previousWord: string; isGameActive: boolean }
  | { success: false; reason: string };

const createPostResponse = (res: PostResponse): Response => {
  const status = res.success ? 200 : 400;
  return new Response(JSON.stringify(res), { status });
};

export const POST = async (req: Request) => {
  const requestJson = await req.json() as { nextWord: string };
  const nextWord = requestJson.nextWord;

  const result = ChainNextWord(nextWord);
  if (result.success) {
    return createPostResponse({
      success: true,
      previousWord: nextWord,
      isGameActive: !result.becomeInActive,
    });
  }

  if (result.reason == "InActive") {
    return createPostResponse({ success: false, reason: "ゲームは既に終了しています" });
  }

  const reasonToMessageMap: { [key in ValidationError]: string } = {
    "IllegalFirstCharacter": "前の単語に続いていません",
    "ZeroLengthString": "単語が入力されていません",
    "UsedWord": "既に使用された単語です",
    "ContainsNonHiraganaCharacter": "単語はひらがなのみで入力してください",
  };
  return createPostResponse({
    success: false,
    reason: reasonToMessageMap[result.error],
  });
};
