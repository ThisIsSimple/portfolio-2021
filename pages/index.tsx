import Head from "next/head";
import styles from "../styles/Home.module.css";
import LogoContainer from "../components/physics/physics";

export default function Home() {
  return (
    <>
      <Head>
        <title>전윤민, 현실에 꿈을 선물하는 개발자</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LogoContainer />
    </>
  );
}
