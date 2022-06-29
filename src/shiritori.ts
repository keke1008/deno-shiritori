let previousWord = "しりとり";
const setOfPreviousWords = new Set([previousWord]);

export type ValidationReason =
  | "ZeroLengthString"
  | "UsedWord"
  | "IllegalFirstCharacter";

export type ValidationResult = { isValid: true } | {
  isValid: false;
  reason: ValidationReason;
};

export const validateNextWord = (nextWord: string): ValidationResult => {
  if (nextWord.length == 0) {
    return { isValid: false, reason: "ZeroLengthString" };
  }
  if (setOfPreviousWords.has(nextWord)) {
    return { isValid: false, reason: "UsedWord" };
  }
  if (previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {
    return { isValid: false, reason: "IllegalFirstCharacter" };
  }
  return { isValid: true };
};

export const setPreviousWord = (nextWord: string): ValidationResult => {
  const result = validateNextWord(nextWord);
  if (result.isValid) {
    previousWord = nextWord;
    setOfPreviousWords.add(previousWord);
  }

  return result;
};

export const getPreviousWord = (): string => {
  return previousWord;
};
