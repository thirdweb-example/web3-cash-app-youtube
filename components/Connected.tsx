import { useAddress, useBalanceForAddress, useContract, useContractRead, useDisconnect, useSDK } from "@thirdweb-dev/react";
import { ACCOUNT_FACTORY_ADDRESS } from "../constants/constants";
import { useState } from "react";
import { SendFunds } from "./SendFunds";
import styles from "../styles/Home.module.css";

export const Connected = () => {
    const address = useAddress();
    const sdk = useSDK();
    const disconnect = useDisconnect();

    const [usernameInput, setUsernameInput] = useState<string>("");
    const [isRegisteringUsername, setIsRegisteringUsername] = useState<boolean>(false);

    const { contract: accountFactory } = useContract(ACCOUNT_FACTORY_ADDRESS);

    const handleCreateUsername = async () => {
        if (!usernameInput) {
            alert("Please enter a username");
            return;
        }
        try {
            const usernameAccount = await accountFactory?.call(
                "accountOfUsername",
                [usernameInput]
            );
            if(usernameAccount === "0x0000000000000000000000000000000000000000") {
                setIsRegisteringUsername(true);
                const accountContract = await sdk?.getContract(address!);
                await accountContract?.call(
                    "register",
                    [usernameInput]
                );
                alert("Username registered");

                setIsRegisteringUsername(false);
            } else {
                alert("Username taken");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const {
        data: hasUsername,
    } = useContractRead(
        accountFactory,
        "hasUsername",
        [address]
    );

    const {
        data: usernameOfAccount,
    } = useContractRead(
        accountFactory,
        "usernameOfAccount",
        [address]
    );

    const {
        data: tokenBalance,
    } = useBalanceForAddress(address!);

    if (!hasUsername) {
        return (
            <div className={styles.bgContainer}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "80%",
                    height: "auto",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "2rem",
                    backgroundColor: "#151515",
                }}>
                    <h1>Username not registered</h1>
                    <p>Please create a username to start using app.</p>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={usernameInput}
                        onChange={(e) => {
                            setUsernameInput(e.target.value);
                        }}
                        className={styles.input}
                    />
                    <button
                        onClick={handleCreateUsername}
                        disabled={isRegisteringUsername}
                        className={styles.button}
                    >{isRegisteringUsername ? "Registering username..." : "Register username"}</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.appCard}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <h1>Welcome {usernameOfAccount}</h1>
                <button 
                    onClick={async() => {
                        await disconnect();
                    }}
                    className={styles.secondaryButton}
                >Sign Out</button>
            </div>
            <div>
                <h3>Balance:</h3>
                <p style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                }}>{tokenBalance?.displayValue} {tokenBalance?.symbol}</p>
            </div>
            <SendFunds />
        </div>
    );
};