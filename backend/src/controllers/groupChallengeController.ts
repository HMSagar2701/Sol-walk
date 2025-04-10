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

    if (group.createdBy.toString() !== userId) {
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
      (p) => p.userId.toString() === userId
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

// GET /status/:groupId/:challengeId
export const getChallengeStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId, challengeId } = req.params as { groupId: string; challengeId: string };

  if (!groupId || !challengeId) {
    res.status(400).json({ message: 'Missing groupId or challengeId' });
    return;
  }

  try {
    const challenge = await GroupChallenge.findOne({
      _id: challengeId,
      groupId: new Types.ObjectId(groupId),
    });

    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    res.status(200).json({
      challengeStatus: challenge.challengeStatus,
      participants: challenge.participants,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenge status', error });
  }
};
// GET /challenges/:groupId
export const getChallengesByGroupId = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId } = req.params;

  if (!groupId) {
    res.status(400).json({ message: 'Missing groupId' });
    return;
  }

  try {
    const challenges = await GroupChallenge.find({ groupId: new Types.ObjectId(groupId) });

    if (!challenges || challenges.length === 0) {
      res.status(404).json({ message: 'No challenges found for this group' });
      return;
    }

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges', error });
  }
};
