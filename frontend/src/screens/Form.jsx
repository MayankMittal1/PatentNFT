import React, { useCallback } from 'react';
import {
  Button,
  Heading,
  HStack,
  Text,
  Image,
  Textarea,
  VStack,
  useToast,
  Link as NativeLink,
} from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import marni from './marni.png';
import hands from './hands.png';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  TransactionInstruction,
  Transaction,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import {
  IntellectualProperty_Size,
  program_id,
  sha256,
  underscoreGenerator,
} from '../ipr';
import { useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

export const NewForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [description, setDescription] = useState('');
  const [newNftAddr, setNewNftAddr] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    setSubmitting(true);
    const hash = await sha256(description);
    console.log(hash);

    const newAccountPubkey = await PublicKey.createWithSeed(
      publicKey,
<<<<<<< HEAD
      seed ,
=======
      hash.substr(0, 10),
>>>>>>> dd7ffa025638425901878d3bd3397480c4718b7b
      program_id
    );

    const lamports = await connection.getMinimumBalanceForRentExemption(
      IntellectualProperty_Size
    );

    const instruction = SystemProgram.createAccountWithSeed({
      fromPubkey: publicKey,
      basePubkey: publicKey,
<<<<<<< HEAD
      seed: seed,//remove the hash and use seed as the name of nft so that it is different everytime
=======
      seed: hash.substr(0, 10),
>>>>>>> dd7ffa025638425901878d3bd3397480c4718b7b
      newAccountPubkey: newAccountPubkey,
      lamports: lamports,
      space: IntellectualProperty_Size,
      programId: program_id,
    });

    const transaction = new Transaction().add(instruction);
    try {
      const signature = await sendTransaction(transaction, connection);
      console.log('created nft account');
      await connection.confirmTransaction(signature, 'processed');
    } catch (e) {
      toast({
        title: (
          <Text>
            Same idea made by you already exists. Visit{' '}
            <NativeLink href={`/#/nft/${newAccountPubkey.toBase58()}`}>
              here
            </NativeLink>{' '}
            to see your existing NFT.
          </Text>
        ),
        status: 'error',
        isClosable: true,
      });
      setSubmitting(false);
      return;
    }

    const initAccount = new TransactionInstruction({
      programId: program_id,
      keys: [
        { pubkey: newAccountPubkey, isSigner: false, isWritable: true },
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(
        Uint8Array.of(
          0,
          ...Array.from(
            new TextEncoder().encode(hash + underscoreGenerator(500))
          )
        )
      ),
    });

    const transaction2 = new Transaction().add(initAccount);
    try {
      const signature2 = await sendTransaction(transaction2, connection);
      await connection.confirmTransaction(signature2, 'processed');
    } catch (e) {
      toast({
        title: (
          <Text>
            Same idea made by you already exists. Visit{' '}
            <NativeLink href={`/#/nft/${newAccountPubkey.toBase58()}`}>
              here
            </NativeLink>{' '}
            to see your existing NFT.
          </Text>
        ),
        status: 'error',
        isClosable: true,
      });
      setSubmitting(false);
      return;
    }

    setNewNftAddr(newAccountPubkey.toBase58());
    console.log(newAccountPubkey.toBase58());
    onOpen();
    setSubmitting(false);
  }, [publicKey, sendTransaction, connection, description, onOpen, toast]);

  return (
    <>
      <VStack alignItems="start" spacing={20}>
        <HStack width="full" height="full">
          <VStack
            width="full"
            height="full"
            spacing={10}
            alignItems="start"
            alignContent="start"
          >
            <Heading color="white">Create a new NFT</Heading>
            <FormControl id="contents" isRequired>
              <FormLabel color="white">
                Enter IPR Text to store in your NFT
              </FormLabel>
              <Textarea
                type="text"
                placeholder="Write information to store in NFT"
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                }}
                height={200}
              />
            </FormControl>
            <HStack justify="space-between" width="full">
              <Button
                bgColor="#FF5B37"
                onClick={onClick}
                isDisabled={!publicKey || description === '' || submitting}
                isLoading={submitting}
              >
                Mint NFT
              </Button>
              <HStack>
                {description === '' && (
                  <HStack
                    p={2}
                    borderColor="#FF5B37"
                    borderWidth={1}
                    borderRadius={10}
                  >
                    <FaExclamationCircle color="#FF5B37" />
                    <Text fontSize="sm" color="#FF5B37">
                      Empty description
                    </Text>
                  </HStack>
                )}
                {!publicKey && (
                  <HStack
                    p={2}
                    borderColor="#FF5B37"
                    borderWidth={1}
                    borderRadius={10}
                  >
                    <FaExclamationCircle color="#FF5B37" />
                    <Text fontSize="sm" color="#FF5B37">
                      Wallet not connected
                    </Text>
                  </HStack>
                )}
              </HStack>
            </HStack>
          </VStack>
          <Image src={marni} />
        </HStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="white">
          <ModalBody>
            <VStack py={10} alignItems="start">
              <Text color="black">
                Your NFT Token was successfully created.
              </Text>
              <FormControl
                id="wallet"
                isRequired
                isReadOnly={true}
                borderColor="gray.700"
                width="70%"
              >
                <Input type="email" value={newNftAddr} color="black" />
              </FormControl>
              <HStack width="70%" justify="space-between">
                <Button
                  colorScheme="orange"
                  variant="outline"
                  as={NativeLink}
                  download={newNftAddr + '.json'}
                  href={
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(JSON.stringify({ description }))
                  }
                >
                  Download Keyfile
                </Button>
                <Button
                  variant="solid"
                  colorScheme="orange"
                  as={Link}
                  to={`/nft/${newNftAddr}`}
                  color="white"
                >
                  See NFT Page
                </Button>
              </HStack>
            </VStack>
            <Image src={hands} position="absolute" right={0} bottom={0} p={2} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
