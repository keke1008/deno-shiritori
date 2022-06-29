export type ValidationReason =
  | "ZeroLengthString"
  | "UsedWord"
  | "IllegalFirstCharacter"
  | "ContainsNonHiraganaCharacter";

export type ValidationResult = { isValid: true } | {
  isValid: false;
  reason: ValidationReason;
};

export class Shiritori {
  previousWord: string;
  setOfPreviousWords = new Set<string>();

  constructor(initialWord: string) {
    this.previousWord = initialWord;
    this.setOfPreviousWords.add(initialWord);
  }

  validateNextWord(nextWord: string): ValidationResult {
    if (nextWord.length == 0) {
      return { isValid: false, reason: "ZeroLengthString" };
    }
    if (!nextWord.match(/^[\u3041-\u309fー]+$/)) { // ひらがな以外の文字を含む場合
      return { isValid: false, reason: "ContainsNonHiraganaCharacter" };
    }
    if (this.setOfPreviousWords.has(nextWord)) {
      return { isValid: false, reason: "UsedWord" };
    }
    if (
      this.previousWord.charAt(this.previousWord.length - 1) !==
        nextWord.charAt(0)
    ) {
      return { isValid: false, reason: "IllegalFirstCharacter" };
    }
    return { isValid: true };
  }

  ChainNextWord(nextWord: string): ValidationResult {
    const result = this.validateNextWord(nextWord);

    if (result.isValid) {
      this.previousWord = nextWord;
      this.setOfPreviousWords.add(this.previousWord);
    }

    return result;
  }

  getPreviousWord(): string {
    return this.previousWord;
  }
}

const globalShiritori = new Shiritori("しりとり");

export const validateNextWord = (nextWord: string): ValidationResult => {
  return globalShiritori.validateNextWord(nextWord);
};

export const ChainNextWord = (nextWord: string): ValidationResult => {
  return globalShiritori.ChainNextWord(nextWord);
};

export const getPreviousWord = (): string => {
  return globalShiritori.getPreviousWord();
};
