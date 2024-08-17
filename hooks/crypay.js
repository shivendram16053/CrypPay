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
  const connection = new Connection(clusterApiUrl("devnet"));

  const { connected, publicKey } = useWallet();
  const [avatar, setAvatar] = useState("");
  const [userAddress, setUserAddress] = useState();
  const [balance, setBalance] = useState("");

  // Get Avatar based on the userAddress
  useEffect(() => {
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

    fetchBalance();
  }, [connected, publicKey]);

  return { connected, publicKey, avatar, userAddress, balance };
};

export default useCryPay;
