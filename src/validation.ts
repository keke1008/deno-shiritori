export type ValidationError =
  | "ZeroLengthString"
  | "UsedWord"
  | "IllegalFirstCharacter"
  | "IllegalLastCharacter"
  | "ContainsNonHiraganaCharacter";

export type ValidationResult<T extends ValidationError = ValidationError> =
  | { isValid: true }
  | { isValid: false; error: T };

const createResult = <T extends ValidationError>(
  isValid: boolean,
  error: T,
): ValidationResult<T> => {
  return isValid ? { isValid } : { isValid, error };
};

/** 与えられた文字列の最後の文字を返す */
const lastChar = (str: string): string => {
  return str.charAt(str.length - 1);
};

/** バリデーションを行う関数 */
export const validate = {
  /** 文字列長が0よりも長いか検証する */
  wordLength: (word: string): ValidationResult<"ZeroLengthString"> => {
    return createResult(word.length !== 0, "ZeroLengthString");
  },

  /** 文字列にひらがなしか含まれていなか検証する */
  nonHiraganaCharacter: (
    word: string,
  ): ValidationResult<"ContainsNonHiraganaCharacter"> => {
    const pattern = /^[\u3041-\u309fー]+$/; // 1文字以上のひらがなにマッチする
    return createResult(pattern.test(word), "ContainsNonHiraganaCharacter");
  },

  /** 前の単語につなげられるか検証する */
  firstCharacter: (
    word: string,
    previousWord: string,
  ): ValidationResult<"IllegalFirstCharacter"> => {
    return createResult(
      lastChar(previousWord) === word.charAt(0),
      "IllegalFirstCharacter",
    );
  },

  /** 既に使われている単語か検証する */
  usedWord: (
    word: string,
    used: (word: string) => boolean,
  ): ValidationResult<"UsedWord"> => {
    return createResult(!used(word), "UsedWord");
  },

  /** 文字が'ん'で終わっていないことを検証する */
  lastCharacter: (word: string): ValidationResult<"IllegalLastCharacter"> => {
    return createResult(lastChar(word) !== "ん", "IllegalLastCharacter");
  },
};

interface Chain<E extends ValidationError = never> {
  or<
    T extends unknown[],
    F extends (word: string, ...args: [...T]) => ValidationResult<EE>,
    EE extends ValidationError = ReturnType<F> extends
      ValidationResult<infer EE> ? EE : never,
  >(f: F, ...args: T): Chain<E | EE>;

  result(): ValidationResult<E>;
}

const failureChain = <E extends ValidationError>(
  result: ValidationResult<E>,
): Chain<E> => {
  const self = {
    or: () => self,
    result: () => result,
  };
  return self;
};

const successChain = <E extends ValidationError>(word: string): Chain<E> => {
  const self: Chain<E> = {
    or: (f, ...args) => {
      const result = f(word, ...args);
      return result.isValid ? self : failureChain(result);
    },
    result: () => ({ isValid: true }),
  };

  return self;
};

/** 複数のバリデーションを簡単に扱えるようにする関数 */
export const validationChain = (word: string): Chain => {
  return successChain(word);
};
