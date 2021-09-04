import React from 'react';
import { Button, Heading, HStack, Image, VStack, Box } from '@chakra-ui/react';
import ikbal from './ikbal.png';

import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <Box p={10}>
      <HStack width="full">
        <VStack
          width="full"
          alignItems="start"
          justify="space-between"
          spacing={0}
        >
          <Heading fontSize={50} fontWeight="extrabold" pb={50}>
            Protect your Intellectual Property Rights using Blockchain. Create
            Patents as NFTs on Solana.
          </Heading>
          <HStack>
            <Button size="lg" variant="outline" as={Link} to="/explore">
              Explore
            </Button>
            <Button size="lg" variant="solid" as={Link} to="/new">
              Create
            </Button>
          </HStack>
        </VStack>
        <Image src={ikbal} />
      </HStack>
    </Box>
  );
};
