// src/utils/walletUtils.ts
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import bs58 from 'bs58';

export const generateGroupChallengeWallet = (filePath: string = './group-challenge-wallet.json') => {
  const keypair = Keypair.generate();
  fs.writeFileSync(filePath, JSON.stringify([...keypair.secretKey]));
  console.log('🔐 Group Challenge Wallet Public Key:', keypair.publicKey.toBase58());
  return {
    publicKey: keypair.publicKey.toBase58(),
    secret: bs58.encode(keypair.secretKey),
  };
};
