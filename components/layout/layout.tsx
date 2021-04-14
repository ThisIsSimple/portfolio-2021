import { AppProps } from "next/app";

const Layout = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};
