import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Duty } from '../entity/Duty.entity';

export const getLastEndedDuty = async (req: Request, res: Response) => {
  try {
    const dutyRepository = AppDataSource.getRepository(Duty);
    const lastEndedDuty = await dutyRepository.findOne({
      where: { isActive: false },
      order: { lastDutyOff: 'DESC' }
    });

    if (lastEndedDuty) {
      res.json({
        lastEndedDutyDate: lastEndedDuty.lastDutyOff,
        totalDutyTime: lastEndedDuty.totalDutyTime,
        lastDutyDuration: lastEndedDuty.lastDutyDuration
      });
    } else {
      res.status(404).json({ message: 'No ended duty found' });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Internal server error', error: errorMessage });
  }
};