import { SmartWallet, useAddress, useWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import EmailSignIn from "../components/EmailLogin";
import { Connected } from "../components/Connected";

const Home: NextPage = () => {
  const address = useAddress();
  const wallet = useWallet();
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {address ? (
          wallet instanceof SmartWallet ? (
            <Connected />
          ) : (
            <>
              <p>Connecting...</p>
            </>
          )
        ) : (
          <EmailSignIn />
        )}
      </div>
    </main>
  );
};

export default Home;
