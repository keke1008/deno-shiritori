import { Head } from "aleph/react";
import { Shiritori } from "~/components/shiritori.tsx";

export default function Index() {
  return (
    <div className="screen index">
      <Head>
        <title>しりとり</title>
        <meta name="description" content="Shiritori app in Deno." />
      </Head>
      <Shiritori />
    </div>
  );
}
