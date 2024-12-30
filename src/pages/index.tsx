import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Project Management App</title>
        <meta name="description" content="Task Management App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{sessionData?.user.name}</div>
    </>
  );
}

