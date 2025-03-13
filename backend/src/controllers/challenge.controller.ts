import { Request, Response } from 'express';

export const createChallenge = (req: Request, res: Response) => {
  // Dummy response for testing
  res.status(201).json({ message: 'Challenge created successfully' });
};

export const getChallenges = (_req: Request, res: Response) => {
  res.status(200).json([
    {
      title: 'Walk 5000 steps',
      participants: 20,
    },
  ]);
};
