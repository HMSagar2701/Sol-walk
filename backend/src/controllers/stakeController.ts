import { Request, Response } from 'express';
import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import UserStake from '../models/UserStake';
import {GroupChallenge, IGroupChallenge} from '../models/GroupChallenge';
import { Types } from 'mongoose';

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
// src/controllers/stakeController.ts

// POST /api/stake/distribute
export const groupDistributeRewards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { groupId, winners, treasuryWallet, adminSecretKey } = req.body;
    console.log('🔄 Distribute Request Received:', req.body);

    if (!groupId || !winners || !treasuryWallet || !adminSecretKey) {
      res.status(400).json({ success: false, message: 'Missing required fields in request body' });
      return;
    }

    console.log('🔐 Decoding admin secret key...');
    let adminWallet;
    try {
      adminWallet = Keypair.fromSecretKey(bs58.decode(adminSecretKey));
    } catch (err) {
      console.error('❌ Invalid admin secret key:', err);
      res.status(400).json({ success: false, message: 'Invalid adminSecretKey provided' });
      return;
    }

    const group = await GroupChallenge.findById(groupId);
    const allChallenges = await GroupChallenge.find({});

    if (!group) {
      console.error(`❌ GroupChallenge not found for groupId: ${groupId}`);
      res.status(404).json({ success: false, message: 'GroupChallenge not found for provided groupId' });
      return;
    }

    const potAmount = group.potAmount || 0;
    if (potAmount <= 0) {
      console.warn(`⚠️ Group potAmount is zero or undefined: ${potAmount}`);
      res.status(400).json({ success: false, message: 'GroupChallenge found, but potAmount is zero or undefined', potAmount });
      return;
    }

    console.log(`✅ Group found. Total Pot: ${potAmount} SOL`);
    const rewardPerWinner = potAmount / winners.length;
    console.log(`🎁 Distributing ${rewardPerWinner} SOL to each of ${winners.length} winners`);

    const transactions: string[] = [];

    for (const winner of winners) {
      const winnerWallet = new PublicKey(winner.walletAddress);
      console.log(`💸 Sending ${rewardPerWinner} SOL to ${winner.walletAddress}`);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: adminWallet.publicKey,
          toPubkey: winnerWallet,
          lamports: rewardPerWinner * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(connection, tx, [adminWallet]);
      transactions.push(signature);
      console.log(`✅ Sent to ${winner.walletAddress} | Signature: ${signature}`);
    }

    // Optionally reset potAmount to zero
    group.potAmount = 0;
    await group.save();

    res.status(200).json({ success: true, message: 'Rewards distributed successfully', transactions });
  } catch (error: any) {
    console.error('❌ Reward Distribution Error:', error.message || error);
    res.status(500).json({ success: false, message: 'Reward distribution failed', error: error.message || error });
  }
};