import { Head } from "aleph/react";
import { Page } from "~/components/Page.tsx";

export default function Index() {
  return (
    <>
      <Head>
        <title>しりとり</title>
        <meta name="description" content="Shiritori app in Deno." />
      </Head>
      <Page />
    </>
  );
}
