import { ChainError, chainNextWord } from "~/src/game.ts";

export interface RequestBody {
  nextWord: string;
}

export interface ErrorResponseBody {
  message: string;
}

const errorResponse = (message: string) => {
  return new Response(JSON.stringify({ message }), { status: 400 });
};

/** しりとりの次の単語をclientから受け取る */
export const POST = async (request: Request) => {
  const { nextWord } = await request.json() as Partial<RequestBody>;
  if (nextWord === undefined) {
    return errorResponse("不正なJsonフォーマット");
  }

  const chainResult = chainNextWord(nextWord);
  if (chainResult.success) {
    return new Response(null, { status: 200 });
  }

  if (chainResult.reason == "InActive") {
    return errorResponse("ゲームは既に終了しています");
  }

  const reasonToMessageMap: { [key in ChainError]: string } = {
    "IllegalFirstCharacter": "前の単語に続いていません",
    "ZeroLengthString": "単語が入力されていません",
    "UsedWord": "既に使用された単語です",
    "ContainsNonHiraganaCharacter": "単語はひらがなのみで入力してください",
  };
  return errorResponse(reasonToMessageMap[chainResult.error]);
};
