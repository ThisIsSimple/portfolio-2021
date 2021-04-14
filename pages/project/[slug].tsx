import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../../styles/Home.module.css";

const Project = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>{slug}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      naver
    </>
  );
};

export default Project;
