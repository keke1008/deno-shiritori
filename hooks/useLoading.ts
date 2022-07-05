import { useState } from "react";

/** Promiseを返す関数に対し，そのPromiseが計算の途中であるかどうかをstateに保存する */
export const useLoading = <
  Args extends never[],
  Returns extends unknown,
  F extends (...args: Args) => Promise<Returns>,
>(
  f: F,
): [(...args: Parameters<F>) => Promise<ReturnType<F>>, boolean] => {
  const [loading, setLoading] = useState(false);

  const g = async (...args: Parameters<F>): Promise<ReturnType<F>> => {
    setLoading(true);
    try {
      return await f(...args);
    } finally {
      setLoading(false);
    }
  };

  return [g, loading];
};
