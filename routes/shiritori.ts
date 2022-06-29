import { getPreviousWord, setPreviousWord } from "~/src/shiritori.ts";

export const GET = (_req: Request) => {
  return new Response(getPreviousWord());
};

export const POST = async (req: Request) => {
  const requestJson = await req.json() as { nextWord: string };
  const nextWord = requestJson.nextWord;

  const isvalidPreviousWord = setPreviousWord(nextWord);
  if (!isvalidPreviousWord) {
    return new Response("前の単語に続いていません.", { status: 400 });
  }
  return new Response(nextWord);
};

