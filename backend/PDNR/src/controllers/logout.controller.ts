import { Request, Response } from 'express';
import { stopDutyController } from './stopDuty.controller';

export const logoutController = (req: Request, res: Response) => {
  console.log('Logout route hit');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Sikertelen Kijelentkezés' });
    }
    res.status(200).json({ message: 'Sikeres kijelentkezés' });
  });
};
