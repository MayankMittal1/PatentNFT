import { HStack, VStack } from '@chakra-ui/react';

import { FaSpinner } from 'react-icons/fa';

import './Loader.css';

export function Loader() {
  return (
    <HStack
      alignItems="center"
      width="full"
      height="100%"
      justify="space-around"
    >
      <VStack justify="space-around">
        <FaSpinner fontSize={100} className="spinner" />
      </VStack>
    </HStack>
  );
}
