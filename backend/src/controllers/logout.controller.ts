import { Request, Response } from 'express';

export const logoutController = (req: Request, res: Response) => {
  console.log('Logout route hit');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};
