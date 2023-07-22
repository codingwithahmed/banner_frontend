import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import React, {  useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {SendSOLToRandomAddress} from './Components/SendSol'
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css'


const Wallet = ({
  children
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
      () => [
          /**
           * Wallets that implement either of these standards will be available automatically.
           *
           *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
           *     (https://github.com/solana-mobile/mobile-wallet-adapter)
           *   - Solana Wallet Standard
           *     (https://github.com/solana-labs/wallet-standard)
           *
           * If you wish to support a wallet that supports neither of those standards,
           * instantiate its legacy wallet adapter here. Common legacy adapters can be found
           * in the npm package `@solana/wallet-adapter-wallets`.
           */
          // new UnsafeBurnerWalletAdapter(),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [network]
  );

  return (
      <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            

              {children}

          </WalletProvider>
      </ConnectionProvider>
  );
};


const AppChild = () => {
  const { wallet } = useWallet();
  const { setVisible } = useWalletModal();

  // Display the connection modal
  const onRequestConnectWallet = () => {
    setVisible(true);
  };

  // Prompt user to connect wallet
  if (!wallet) {
    return <button onClick={onRequestConnectWallet}>Connect Wallet</button>;
  }

  return (
    <main>
      <p>Wallet successfully connected!</p>
      <p>{wallet.publicKey.toString()}</p>
    </main>
  );
};
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Wallet>
              
              <App phantom = {(
                <WalletModalProvider>
                  <WalletMultiButton />
                  <WalletDisconnectButton />
              </WalletModalProvider>
              )} />
        <SendSOLToRandomAddress />
    </Wallet>
  </React.StrictMode>,
)
