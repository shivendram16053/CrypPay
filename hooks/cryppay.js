import React, { useState, useEffect } from "react";
import { getAvatarUrl } from "../functions/getAvatarUrl";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";

const useCryPay = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint);
  const { connected, publicKey, sendTransaction } = useWallet();
  const [avatar, setAvatar] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [transactionPurpose, setTransactionPurpose] = useState("");
  const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false);

  const useLocalStorage = (storageKey, fallbackState) => {
    const [value, setValue] = useState(
      JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
    );
    useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);

    return [value, setValue];
  };

  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  // Function to fetch and set balance
  const fetchBalance = async () => {
    if (connected && publicKey) {
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
        setUserAddress(publicKey.toString());
        setAvatar(getAvatarUrl(publicKey));
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    } else {
      setBalance("");
      setUserAddress("");
      setAvatar("");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [connected, publicKey, connection]);

  // Poll for balance updates
  useEffect(() => {
    let intervalId;

    if (connected && publicKey) {
      intervalId = setInterval(() => {
        fetchBalance();
      }, 5000); // Poll every 5 seconds
    }

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [connected, publicKey]);

  // Create Transaction
  const makeTransaction = async (fromWallet, toWallet, amount, reference) => {
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromWallet,
    });

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: toWallet,
      lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
    });

    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });

    transaction.add(transferInstruction);

    return transaction;
  };

  const doTransaction = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const fromWallet = publicKey;
      const toWallet = new PublicKey(receiver);
      const bnAmount = new BigNumber(amount);
      const reference = Keypair.generate().publicKey;
      const transaction = await makeTransaction(
        fromWallet,
        toWallet,
        bnAmount,
        reference
      );

      // Send the transaction and wait for confirmation
      const txnHash = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(txnHash);

      // Update balance after transaction
      await fetchBalance();
      console.log("Transaction successful with hash:", txnHash);

      const newID = (transactions.length + 1).toString();
      const newTransaction = {
        id: newID,
        from: {
          name: publicKey,
          handle: publicKey,
          avatar: avatar,
          verified: true,
        },
        to: {
          name: receiver,
          handle: "-",
          avatar: getAvatarUrl(receiver.toString()),
          verified: false,
        },
        description: transactionPurpose,
        transactionDate: new Date(),
        status: "completed",
        amount: amount,
        source: "-",
        identifier: "-",
      };

      setNewTransactionModalOpen(false);
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return {
    connected,
    publicKey,
    avatar,
    userAddress,
    balance,
    doTransaction,
    amount,
    setAmount,
    receiver,
    setReceiver,
    transactionPurpose,
    setTransactionPurpose,
    transactions,
    setTransactions,
    setNewTransactionModalOpen,
    newTransactionModalOpen,
  };
};

export default useCryPay;
