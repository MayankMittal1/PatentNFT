import React from 'react';
import {
  Button,
  Heading,
  HStack,
  Link,
  Input,
  VStack,
  Box,
  Text,
  SimpleGrid,
  IconButton,
  useDisclosure,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useCallback } from 'react';
import {
  FaCheck,
  FaDownload,
  FaFile,
  FaLock,
  FaTimes,
  FaUpload,
} from 'react-icons/fa';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  IntellectualPropertySchema,
  IntellectualProperty,
  program_id,
  stringConcat,
  stringParser,
  sha256,
} from '../ipr';
import * as borsh from 'borsh';
import { Loader } from './Loader';

function getFileName(s) {
  const arr = s.split('/');
  return arr[arr.length - 1];
}

export const NFTPage = () => {
  const { addr } = useParams();
  const [nftDetails, setNftDetails] = useState(null);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [realData, setRealData] = useState('');
  const [realName, setRealName] = useState('');
  const toast = useToast();

  useEffect(() => {
    async function getData() {
      const greetedPubkey = new PublicKey(addr);
      const accountInfo = await connection.getAccountInfo(greetedPubkey);
      if (accountInfo === null) {
        setNftDetails({});
        return;
      }
      const property = borsh.deserialize(
        IntellectualPropertySchema,
        IntellectualProperty,
        accountInfo.data
      );
      const parsedData = stringParser(property.uri);
      const isPublic = property.is_public === '1';
      var sigs = await connection.getSignaturesForAddress(greetedPubkey);
      sigs = sigs.reverse();
      const milliseconds = sigs[0].blockTime * 1000;
      const d = new Date(milliseconds);
      const ds = d.toLocaleString();
      setNftDetails({
        public: isPublic,
        owner: property.property_owner,
        name: isPublic ? JSON.parse(parsedData).name : '',
        description: isPublic ? JSON.parse(parsedData).description : '',
        files: isPublic ? JSON.parse(parsedData).files : [],
        time: ds,
        hash: property.hash,
        verified: isPublic
          ? property.hash === (await sha256(JSON.parse(parsedData).description))
          : false,
      });
      console.log(property);
    }
    getData();
  }, [addr, connection]);

  const onClick = useCallback(async () => {
    const realDataHash = await sha256(realData);
    if (realDataHash !== nftDetails.hash) {
      console.log(realDataHash);
      console.log(nftDetails.hash);
      alert('invalid data');
      return;
    }
    const newAccountPubkey = new PublicKey(addr);
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
          1,
          ...Array.from(
            new TextEncoder().encode(
              stringConcat(
                JSON.stringify({ description: realData, name: realName }),
                500
              )
            )
          )
        )
      ),
    });

    const transaction2 = new Transaction().add(initAccount);
    const signature2 = await sendTransaction(transaction2, connection);
    await connection.confirmTransaction(signature2, 'processed');
    onClose();
    setNftDetails({
      ...nftDetails,
      public: true,
      description: realData,
      verified: true,
      name: realName,
    });
  }, [
    addr,
    realData,
    publicKey,
    sendTransaction,
    connection,
    nftDetails,
    onClose,
    realName,
  ]);

  const setFile = e => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async e => {
      const text = e.target.result;
      try {
        const ob = JSON.parse(text);
        setRealData(ob.description);
      } catch (e) {
        toast({
          title: 'invalid file',
          status: 'error',
          isClosable: true,
        });
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <>
      <Box p={20}>
        {!nftDetails && <Loader />}
        {nftDetails && (
          <>
            <HStack mb={50} alignItems="center">
              <FaFile fontSize={29} />
              <Heading>
                {nftDetails.public ? nftDetails.name : 'Undisclosed Idea'}
              </Heading>
            </HStack>
            <HStack width="full">
              <VStack
                width="full"
                alignItems="start"
                justify="space-between"
                spacing={5}
              >
                <HStack>
                  <Text fontWeight="bold">Owner Wallet: </Text>
                  <Text>{nftDetails.owner}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Date of upload: </Text>
                  <Text>{nftDetails.time}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Token: </Text>
                  <Text>{addr}</Text>
                </HStack>
                {!nftDetails.public &&
                  publicKey &&
                  nftDetails.owner === publicKey.toBase58() && (
                    <>
                      <Text>
                        Looks like you are the owner of this NFT. Do you want to
                        make this idea public?
                      </Text>
                      <Button onClick={onOpen}>Make it public!</Button>
                    </>
                  )}
                {nftDetails.public && (
                  <>
                    <HStack alignItems="start">
                      <Text fontWeight="bold">Description: </Text>
                      <Text>{nftDetails.description}</Text>
                    </HStack>
                    <HStack alignItems="center">
                      <Text fontWeight="bold">Description verified: </Text>
                      {nftDetails.verified ? (
                        <FaCheck color="green" />
                      ) : (
                        <FaTimes color="red" />
                      )}
                    </HStack>
                    <HStack alignItems="start" width="full">
                      <Text fontWeight="bold">Files: </Text>
                      <SimpleGrid columns={3} width="full">
                        {(!nftDetails.files ||
                          nftDetails.files.length === 0) && (
                          <Text>No files attached</Text>
                        )}
                        {nftDetails.files &&
                          nftDetails.files.map((v, i, arr) => (
                            <HStack px={10} alignItems="center" py={1}>
                              <FaFile /> <Text>{getFileName(v)}</Text>
                              <IconButton
                                icon={<FaDownload />}
                                as={Link}
                                href={v}
                              />
                            </HStack>
                          ))}
                      </SimpleGrid>
                    </HStack>
                  </>
                )}
              </VStack>
              {!nftDetails.public && <FaLock fontSize={100} />}
            </HStack>
          </>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="white">
          <ModalHeader color="black">Make your idea public</ModalHeader>
          <ModalBody>
            <VStack pb={5} alignItems="start">
              <Text color="black">Enter the idea name</Text>
              <Input
                color="black"
                value={realName}
                onChange={e => {
                  setRealName(e.target.value);
                }}
                borderColor="black"
              />
              <Text color="black">Enter the real description</Text>
              <Textarea
                color="black"
                value={realData}
                onChange={e => {
                  setRealData(e.target.value);
                }}
                borderColor="black"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <input type="file" id="fileup" hidden onChange={setFile} />
            <Button
              variant="outline"
              onClick={e => {
                e.preventDefault();
                document.getElementById('fileup').click();
              }}
              leftIcon={<FaUpload />}
              mr={5}
            >
              Fill from keyfile
            </Button>
            <Button variant="solid" color="white" onClick={onClick}>
              Verify and Go public!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
