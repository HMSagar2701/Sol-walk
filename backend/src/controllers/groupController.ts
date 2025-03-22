import { Request,NextFunction, Response } from 'express';
import { Group } from '../models/Group';
import { AuthRequest } from '../middlewares/auth.middleware';
import mongoose from 'mongoose';
// POST /create-group
export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupName } = req.body;
  const userId = req.userId;

  if (!groupName || !userId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const group = await Group.create({
      groupName,
      createdBy: userId,
      members: [userId],
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

// POST /invite-member
// src/controllers/groupController.ts (append this to existing file)


export const acceptGroupInvite = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const userId = req.userId;

  if (!groupId || !userId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId); // ✅ convert string to ObjectId

    const alreadyMember = group.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (!alreadyMember) {
      group.members.push(userObjectId);
      await group.save();
    }

    res.status(200).json({
      message: alreadyMember
        ? 'Already a group member'
        : 'Joined the group successfully',
      group,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing invite', error });
  }
};

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;

  // ✅ Correct validation of ObjectId
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    res.status(400).json({ message: 'Invalid Group ID' });
    return;
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error });
  }
};

export const getGroupsByUserDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ message: 'Missing user ID' });
    return;
  }

  try {
    const groups = await Group.find({ members: userId })
      .populate('createdBy', 'username email') // Optional: populate creator info
      .populate('members', 'username email')   // Optional: populate member info
      .sort({ createdAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user groups', error });
  }
};
