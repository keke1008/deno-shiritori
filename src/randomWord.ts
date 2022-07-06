// https://ja.wikipedia.org/wiki/果物
const words = [
  "なし",
  "まるめろ",
  "りんご",
  "あんず",
  "うめ",
  "さくらんぼ",
  "すもも",
  "もも",
  "あーもんど",
  "いちょう",
  "くり",
  "あけび",
  "いちじく",
  "かき",
  "かしす",
  "きいちご",
  "きういふるーつ",
  "ぐみ",
  "くわ",
  "こけもも",
  "ざくろ",
  "なつめ",
  "にわうめ",
  "ふさすぐり",
  "ぶどう",
  "くるみ",
  "おりーぶ",
  "びわ",
  "やまもも",
] as const;

export const getRandomWord = () => {
  const length = words.length;
  const index = Math.floor(Math.random() * length);
  return words[index];
};
