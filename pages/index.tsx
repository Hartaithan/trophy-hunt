import { NextPage } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return <h3 className={inter.className}>Hello world!</h3>;
};

export default Home;
