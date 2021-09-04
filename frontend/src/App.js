import React, { useMemo } from 'react';
import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { Navbar } from './screens/Navbar';
import { NewForm } from './screens/Form';

// solana imports
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
} from '@solana/wallet-adapter-wallets';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import { clusterApiUrl } from '@solana/web3.js';

// react router dom imports
import { Switch, Route } from 'react-router-dom';
import { Home } from './screens/Home';
import { NFTPage } from './screens/NFTPage';
import { Explore } from './screens/Explore';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      variants: {
        // 4. We can override existing variants
        solid: {
          bg: '#FF5B37',
          _hover: {
            bg: '#FF5B37',
          },
        },
        outline: {
          borderColor: '#FF5B37',
          color: '#FF5B37',
          _hover: {
            borderColor: '#FF5B37',
          },
        },
      },
    },
  },
});

function App() {
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSolongWallet(),
      getMathWallet(),
      getSolletWallet(),
    ],
    []
  );
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            <Box
              fontSize="xl"
              backgroundColor="#020D27"
              width="full"
              height="100%"
              px={85}
            >
              {/* <ColorModeSwitcher /> */}
              <Switch>
                <Route path="/new">
                  <Navbar selected={3} />
                  <NewForm />
                </Route>
                <Route path="/nft/:addr">
                  <Navbar selected={2} />
                  <NFTPage />
                </Route>
                <Route path="/explore">
                  <Navbar selected={2} />
                  <Explore />
                </Route>
                <Route path="/">
                  <Navbar selected={1} />
                  <Home />
                </Route>
              </Switch>
            </Box>
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
}

export default App;
