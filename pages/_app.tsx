import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app"; 
import "../styles/globals.css";
import { withAuth } from "@/utils/withAuth";

export const getServerSideProps = withAuth();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
