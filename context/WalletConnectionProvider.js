import { ConnectionProvider , WalletProvider } from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {PhantomWalletAdapter,SolletExtensionWalletAdapter,SolflareWalletAdapter} from "@solana/wallet-adapter-wallets"
import { useMemo } from "react";

const WalletConnectionProvider = ({children})=>{
    const endpoint  = useMemo(()=> "https://api.devnet.solana.com",[])

    const wallets = useMemo(()=>[new PhantomWalletAdapter,new SolletExtensionWalletAdapter, new SolflareWalletAdapter])

    return(
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider >{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletConnectionProvider;