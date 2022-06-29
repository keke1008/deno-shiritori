let previousWord = "しりとり";

export const isValidNextWord = (nextWord: string): boolean => {
  return nextWord.length > 0 &&
    previousWord.charAt(previousWord.length - 1) === nextWord.charAt(0);
};

export const setPreviousWord = (nextWord: string): boolean => {
  if (!isValidNextWord(nextWord)) {
    return false;
  }
  previousWord = nextWord;
  return true;
};

export const getPreviousWord = (): string => {
  return previousWord;
};
