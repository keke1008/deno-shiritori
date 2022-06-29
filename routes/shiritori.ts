import {
  ChainNextWord,
  getPreviousWord,
  ValidationReason,
} from "~/src/shiritori.ts";

export const GET = (_req: Request) => {
  return new Response(getPreviousWord());
};

export const POST = async (req: Request) => {
  const requestJson = await req.json() as { nextWord: string };
  const nextWord = requestJson.nextWord;

  const result = ChainNextWord(nextWord);
  if (result.isValid) {
    return new Response(nextWord);
  }

  const reasonToMessageMap: { [key in ValidationReason]: string } = {
    "IllegalFirstCharacter": "前の単語に続いていません",
    "ZeroLengthString": "単語が入力されていません",
    "UsedWord": "既に使用された単語です",
    "ContainsNonHiraganaCharacter": "単語はひらがなのみで入力してください",
  };
  return new Response(reasonToMessageMap[result.reason], { status: 400 });
};
