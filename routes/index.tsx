import { Head } from "aleph/react";
import { Shiritori } from "~/components/shiritori.tsx";
import { Header } from "~/components/Header.tsx";

export default function Index() {
  return (
    <div className="screen index">
      <Head>
        <title>しりとり</title>
        <meta name="description" content="Shiritori app in Deno." />
      </Head>
      <Header />
      <div className="w-full flex justify-center">
        <Shiritori />
      </div>
    </div>
  );
}
