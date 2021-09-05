<h1 align="center">PatentNFT</h1>
<p align="center"><img src="https://i.imgur.com/GAJdSUA.png" width="20%"></p>
<p align="center" >Make modifyable NFTs as a proof of the ownership of idea. Think now, publicise later!</p>
<p align="center" ><a href="https://patent.sckr.me">https://patent.sckr.me</a></p>

## Problem Statement

Suppose you have an idea - for example a startup idea. You get pretty excited for it - but you don't want to tell the world about your idea right now, not before you actually make a product out of it. This time period between first ideation and product release is a crucial time - where you cannot afford your idea to be released in public. But if it does get leaked to the world and someone else steals your idea - how helpful would it be to have a way to prove the world that you were the one who thought about it first? This problem is not just limited to corporate scene, but might also happen in academia too. We introduce PatentNFTs to solve this problem.

## Enter PatentNFT

PatentNFT helps such ideators by letting them add a "proof of idea" on the blockchain as a unique token without actually adding their idea in clear on it. When the ideator decides to publicise the idea, they can prove that they thought about the idea back (when they uploaded the proof) using the proof existing on the blockchain. PatentNFT provides two guarantees -

1. When the ideator uploads the proof of idea, no-one can fetch the original idea just from the proof stored on the blockchain. The idea is not stored in plain on the chain before it is being made public.
2. When the ideator tries to make their idea public, they cannot cheat by uploading a different idea than what they thought about back.

These two guarantees cater to both the ideator and general public by keeping the idea secret and proving only valid ideas.

## Technology

The backbone of this project is [Cryptographic Commitment Schemes](https://en.wikipedia.org/wiki/Commitment_scheme). These protocols allow us to commit to some data without revealing the data, and revealing the data later. We use blockchain to prove the "time" of idea. If the proof of idea exists on a block, the it proves that the idea was thought about before the creation time of block. Other than these protocols, we used [Solana](https://solana.com) as the choice of blockchain, with frontend written in [React.js](https://reactjs.org) using the [Chakra UI Framework](http://chakra-ui.com/).

## Screenshots

![](https://i.imgur.com/lum1dxc.png)
<p align="center" >Landing page</p>

![](https://i.imgur.com/Y7SptuT.png)
<p align="center" >Idea creation form</p>

![](https://i.imgur.com/dZapEFX.png)
<p align="center" >Idea page when idea is private</p>

![](https://i.imgur.com/8282ozD.png)
<p align="center" >Idea page when idea is public</p>

![](https://i.imgur.com/Qs7LEiz.png)
<p align="center" >Explore page to see public ideas of other people</p>

## Team

1. Mayank Mittal ([@MayankMittal1](http://github.com/MayankMittal1/))
2. Pragyansh Chaturvedi ([@r41k0u](https://github.com/r41k0u))
3. Aman Gupta
4. Shreyaa Sharma ([@cypherean](http://github.com/cypherean))
5. Kanav Gupta ([@kanav99](https://github.com/kanav99))