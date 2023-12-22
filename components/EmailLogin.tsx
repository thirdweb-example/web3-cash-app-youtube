import { embeddedWallet, smartWallet, useConnect, useEmbeddedWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { ACCOUNT_FACTORY_ADDRESS } from "../constants/constants";

export default function EmailSignIn() {
    const [state, setState] = useState<
        "init" | "sending_email" | "email_verification" | "connected"
    >("init");
    const [email, setEmail] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState<string>("");

    const { connect, sendVerificationEmail } = useEmbeddedWallet();

    const connectSmartWallet = useConnect();
    const smartWalletConfig = smartWallet(embeddedWallet(), {
        factoryAddress: ACCOUNT_FACTORY_ADDRESS,
        gasless: true,
    });

    const handleEmailEntered = async () => {
        if (!email) {
            alert("Please enter an email");
            return;
        }
        setState("sending_email");
        await sendVerificationEmail({ email });
        setState("email_verification");
    };

    const handleEmailVerification = async () => {
        if (!email || !verificationCode) {
            alert("Please enter an verification code");
            return;
        }
        try {
            const personalWallet = await connect({ strategy: "email_verification", email, verificationCode });
            const smartWallet = await connectSmartWallet(
                smartWalletConfig,
                {
                    personalWallet: personalWallet,
                    chainId: 80001,
                }
            )
            const isDeployed = await smartWallet.isDeployed();
            if (!isDeployed) {
                await smartWallet.deploy();
            }
        } catch (error) {
            console.log(error);
        }
        
    };

    if (state === "sending_email") {
        return <div><p>Sending OTP email...</p></div>;
    }

    if (state === "email_verification") {
        return (
            <div className={styles.bgContainer}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "50%",
                    height: "auto",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "2rem",
                    backgroundColor: "#151515",
                }}>
                    <h3>Enter the verification code sent to your email</h3>
                    <input
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        style={{
                            width: "100%",
                            height: "42px",
                            marginBottom: "1rem",
                            border: "1px solid #CCC",
                            borderRadius: "8px",
                            padding: "0.5rem 1rem"
                        }}
                    />
                    <button 
                        className={styles.emailSignInBtn}
                        onClick={handleEmailVerification}
                        style={{
                            width: "100%",
                            height: "42px",
                            marginBottom: "1rem",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "RoyalBlue",
                            color: "#FFF",
                            border: "1px solid RoyalBlue",
                            borderRadius: "8px",
                        }}
                    >
                        Verify
                    </button>
                    <a onClick={() => setState("init")}>
                        <p style={{ color: "royalblue", cursor: "pointer", textAlign: "center" }}>Go Back</p>
                    </a>
                </div>
            </div>
    );
    }

    return (
        <div className={styles.bgContainer}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "50%",
                height: "auto",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "2rem",
                backgroundColor: "#151515",
            }}>
                <h1>Sign In</h1>
                <input 
                    type="text" 
                    style={{
                        width: "100%",
                        height: "42px",
                        marginBottom: "1rem",
                        border: "1px solid #CCC",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem"
                    }}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                className={styles.emailSignInBtn}
                    style={{
                        width: "100%",
                        height: "42px",
                        marginBottom: "1rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "RoyalBlue",
                        color: "#FFF",
                        border: "1px solid RoyalBlue",
                        borderRadius: "8px",
                    }}
                    onClick={handleEmailEntered}
                >Sign In</button>
            </div>
        </div>
    );
}