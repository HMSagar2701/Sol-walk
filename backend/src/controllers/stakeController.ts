import { Request, Response } from 'express';
import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import UserStake from '../models/UserStake';
import {GroupChallenge} from '../models/GroupChallenge';

dotenv.config();

const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');

// POST /api/stake/stake
export const stakeToGroupTreasury = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, groupId, amount, userSecretKey, treasuryWallet } = req.body;
      console.log('🟡 Received stake request:', req.body);
  
      if (!userId || !groupId || !amount || !userSecretKey || !treasuryWallet) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }
  
      console.log('🔐 Decoding secret key...');
      const fromWallet = Keypair.fromSecretKey(bs58.decode(userSecretKey));
      console.log('✅ Wallet decoded:', fromWallet.publicKey.toBase58());
  
      const toWallet = new PublicKey(treasuryWallet);
      console.log('📤 Preparing transaction to:', toWallet.toBase58());
  
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: toWallet,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
  
      console.log('🚀 Sending transaction...');
      const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
      console.log('✅ Transaction signature:', signature);
  
      console.log('💾 Saving to DB...');
      await UserStake.create({
        userId,
        groupId,
        stakedAmount: amount,
        treasuryWallet,
        transactionSignature: signature,
        timestamp: new Date(),
      });
  
      console.log('📈 Updating GroupChallenge pot...');
      await GroupChallenge.findOneAndUpdate(
        { groupId },
        { $inc: { potAmount: amount } },
        { upsert: true, new: true }
      );
  
      res.status(200).json({ success: true, message: 'Stake successful', tx: signature });
    } catch (error: any) {
      console.error('❌ Stake Error:', error.message || error);
      res.status(500).json({ success: false, message: 'Staking failed', error: error.message || error });
    }
  };
  
export const getUserStake = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, groupId } = req.query;
  
      const query: any = {};
      if (userId) query.userId = userId;
      if (groupId) query.groupId = groupId;
  
      // Fetch stakes from the database
      const stakes = await UserStake.find(query);
  
      res.status(200).json({ success: true, data: stakes });
    } catch (error) {
      console.error('Get Stake Error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch stakes' });
    }
  };
  