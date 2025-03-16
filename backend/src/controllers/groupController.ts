import { Response } from 'express';
import { Group } from '../models/Group';
import { AuthRequest } from '../middlewares/auth.middleware';

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
export const inviteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId, userId: invitedUserId } = req.body;
  const inviterId = req.userId;

  if (!groupId || !invitedUserId || !inviterId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (!group.members.includes(inviterId as any)) {
      res.status(403).json({ message: 'Only group members can invite others' });
      return;
    }

    if (group.members.includes(invitedUserId)) {
      res.status(400).json({ message: 'User already in the group' });
      return;
    }

    group.members.push(invitedUserId);
    await group.save();

    res.status(200).json({ message: 'User added to group' });
  } catch (error) {
    res.status(500).json({ message: 'Error inviting member', error });
  }
};
