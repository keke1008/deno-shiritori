import { Head } from "aleph/react";
import { useEffect, useRef, useState } from "react";

export default function Index() {
  const [previousWord, setPreviousWord] = useState<string>();
  useEffect(() => {
    fetch("/shiritori")
      .then((response) => response.text())
      .then(setPreviousWord);
  }, []);

  const nextWord = useRef<HTMLInputElement>(null!);
  const handleClick = async () => {
    const response = await fetch("/shiritori", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextWord: nextWord.current.value }),
    });
    if (response.status !== 200) {
      alert(await response.text());
      return;
    }
    setPreviousWord(await response.text());
  };

  return (
    <div className="screen index">
      <Head>
        <title>しりとり</title>
        <meta name="description" content="Shiritori app in Deno." />
      </Head>

      <h1>しりとり</h1>
      <p>前の単語: {previousWord}</p>
      <input ref={nextWord} type="text" />
      <button onClick={handleClick}>送信</button>
    </div>
  );
}
