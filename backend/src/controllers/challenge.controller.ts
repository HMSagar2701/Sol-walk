import { Request, Response } from 'express';

export const getChallenges = (_req: Request, res: Response) => {
  res.json([{ title: 'Walk 5000 steps', participants: 20 }]);
};

export const createChallenge = (req: Request, res: Response) => {
  res.status(201).json({ message: 'Challenge created successfully' });
};
