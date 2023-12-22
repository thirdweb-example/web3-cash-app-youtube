import { useAddress, useBalanceForAddress, useContract, useSDK } from "@thirdweb-dev/react";
import { useState } from "react";
import { ACCOUNT_FACTORY_ADDRESS } from "../constants/constants";
import styles from "../styles/Home.module.css";

export const SendFunds = () => {
    const address = useAddress();
    const sdk = useSDK();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    const [receiverUsername, setReceiverUsername] = useState<string>("");
    const [sendAmount, setSendAmount] = useState<number>(0);
    const [isSendingFunds, setIsSendingFunds] = useState<boolean>(false);

    const { contract: accountFactory } = useContract(ACCOUNT_FACTORY_ADDRESS);

    const {
        data: tokenBalance,
    } = useBalanceForAddress(address!);

    const sendFunds = async () => {
        if(!receiverUsername || sendAmount === 0) {
            alert("Please create a username and fill in the amount to send");
            return;
        }
        if(sendAmount > Number(tokenBalance?.displayValue)) {
            alert("Insufficient funds");
            return;
        }
        try {
            setIsSendingFunds(true);
            const receiverWalletAddress = await accountFactory?.call(
                "accountOfUsername",
                [receiverUsername]
            );
            if(receiverWalletAddress === "0x0000000000000000000000000000000000000000") {
                alert("Username does not exist");
                return;
            }
            await sdk?.wallet.transfer(
                receiverWalletAddress!,
                sendAmount,
            );
            alert("Funds sent");
            setIsSendingFunds(false);
            setReceiverUsername("");
            setSendAmount(0);
        } catch (error) {
            console.log(error);
            alert("Error sending funds");
        } finally {
            setIsSendingFunds(false);
        }
    };

    if(!isModalOpen) {
        return (
            <button
                onClick={() => {
                    setIsModalOpen(true);
                }}
                className={styles.button}
            >Send Funds</button>
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
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    width: "100%",
                }}>
                    <button
                        onClick={() => {
                            setIsModalOpen(false);
                        }}
                        className={styles.secondaryButton}
                    >Close</button>
                </div>
                <div>
                    <h3>Send:</h3>
                    <p style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    }}>{tokenBalance?.displayValue} MATIC</p>
                </div>
                <p>To:</p>
                <input
                    type="text"
                    placeholder="Username" 
                    value={receiverUsername}
                    onChange={(e) => {
                        setReceiverUsername(e.target.value);
                    }}
                    className={styles.input}
                />
                <p>Amount:</p>
                <input 
                    type="number"
                    value={sendAmount}
                    step={0.01}
                    onChange={(e) => {
                        setSendAmount(Number(e.target.value));
                    }}
                    className={styles.input}
                />
                <button
                    onClick={sendFunds}
                    disabled={isSendingFunds}
                    className={styles.button}
                >{isSendingFunds ? "Sending..." : "Send Funds"}</button>
            </div>
        </div>
    );
};