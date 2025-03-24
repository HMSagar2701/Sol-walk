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

// POST /join-group
export const joinGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId } = req.body;
  const userId = req.userId;

  // Debugging: log the received data
  console.log('Received request to join group');
  console.log('User ID:', userId);
  console.log('Request Body:', req.body);  // Log the entire request body

  if (!groupId || !userId) {
    // Log details when required fields are missing
    if (!groupId) {
      console.log('groupId is missing');
    }
    if (!userId) {
      console.log('userId is missing');
    }

    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    // Fetch the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      console.log('Group not found with ID:', groupId);  // Debugging log
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Debugging: log the fetched group
    console.log('Group fetched:', group);

    // Convert userId to ObjectId (if needed)
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if the user is already a member of the group
    const alreadyMember = group.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (alreadyMember) {
      console.log('User is already a member of the group');  // Debugging log
      res.status(400).json({ message: 'Already a group member' });
      return;
    }

    // Add the user to the group members
    group.members.push(userObjectId);
    await group.save();

    // Debugging: log the updated group
    console.log('Group updated with new member:', group);

    res.status(200).json({
      message: 'Joined the group successfully',
      group,
    });
  } catch (error) {
    // Debugging: log the error
    console.error('Error joining the group:', error);
    res.status(500).json({ message: 'Error joining the group', error });
  }
};