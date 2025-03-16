import { Response } from 'express';
import { GroupChallenge } from '../models/GroupChallenge';
import { Group } from '../models/Group';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Types } from 'mongoose';

// POST /create-group-challenge
export const createGroupChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId, challengeGoal, bidAmount, currency, startDate, endDate } = req.body;
  const userId = req.userId;

  if (!groupId || !challengeGoal || !bidAmount || !currency || !startDate || !endDate || !userId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (String(group.createdBy) !== userId) {
      res.status(403).json({ message: 'Only group creator can create challenges' });
      return;
    }

    const challenge = await GroupChallenge.create({
      groupId,
      challengeGoal,
      bidAmount,
      currency,
      startDate,
      endDate,
      challengeStatus: 'UPCOMING',
      participants: [],
    });

    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error creating challenge', error });
  }
};

// POST /join-group-challenge
export const joinGroupChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  const { challengeId } = req.body;
  const userId = req.userId;

  if (!challengeId || !userId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const challenge = await GroupChallenge.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    const group = await Group.findById(challenge.groupId);
    if (!group || !group.members.includes(userId as any)) {
      res.status(403).json({ message: 'Only group members can join challenge' });
      return;
    }

    const alreadyJoined = challenge.participants.some(
      (p) => String(p.userId) === userId
    );
    if (alreadyJoined) {
      res.status(400).json({ message: 'User already joined challenge' });
      return;
    }

    if (new Date(challenge.startDate) <= new Date()) {
      res.status(400).json({ message: 'Challenge already started' });
      return;
    }

    challenge.participants.push({
      userId: new Types.ObjectId(userId),
      joinedAt: new Date(),
      stakeStatus: 'PENDING',
      progress: 0,
    });

    await challenge.save();

    // TODO: Call Solana staking logic here (e.g. stake(userId, challengeId, bidAmount, currency))

    res.status(200).json({ message: 'Joined challenge successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining challenge', error });
  }
};
