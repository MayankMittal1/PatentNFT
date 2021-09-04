import {
  Button,
  HStack,
  Text,
  Link as NativeLink,
  Image,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';

import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';

export const Navbar = ({ selected }) => {
  const history = useHistory();
  const path = history.location.pathname;
  console.log(path);
  return (
    <HStack justify="space-between" py={55}>
      <HStack pr={300} spacing={3}>
        <Image src="/logo.png" height={39} />
        <Text fontWeight="semibold" color="white">
          PatentNFTs
        </Text>
      </HStack>
      <HStack justify="space-between" width="full">
        <Box borderBottomWidth={selected === 1 ? 2 : 0} borderColor="#FF5B37">
          <Link to="/">
            <Text fontWeight="semibold" color="white">
              Home
            </Text>
          </Link>
        </Box>
        <Box borderBottomWidth={selected === 2 ? 2 : 0} borderColor="#FF5B37">
          <Link to="/explore">
            <Text fontWeight="semibold" color="white">
              Explore
            </Text>
          </Link>
        </Box>
        <Box borderBottomWidth={selected === 3 ? 2 : 0} borderColor="#FF5B37">
          <Link to="/new">
            <Text fontWeight="semibold" color="white">
              Create
            </Text>
          </Link>
        </Box>
        <Button
          variant="solid"
          borderRadius="full"
          backgroundColor="white"
          rightIcon={<FaGithub color="black" />}
          as={NativeLink}
          href="https://github.com/"
        >
          <Text fontWeight="semibold" color="black">
            GitHub
          </Text>
        </Button>
        <WalletMultiButton />
      </HStack>
    </HStack>
  );
};
