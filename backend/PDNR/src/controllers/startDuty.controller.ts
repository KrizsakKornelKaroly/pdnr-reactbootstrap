import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Duty } from "../entity/Duty.entity";
import { UserInfo } from "../entity/UserInfo.entity";
import { startDutyTimer } from "../services/duty.service";
import { findOrCreateDuty } from "../utils/findOrCreateDuty";

const AUTO_END_DURATION_MS = 4 * 60 * 60 * 1000; // 1 minute for testing, adjust as needed

export const startDutyController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.session.user_id as number;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in session" });
    }

    const dutyRepository = AppDataSource.getRepository(Duty);
    const userInfoRepository = AppDataSource.getRepository(UserInfo);

    // Find or create duty
    let duty = await findOrCreateDuty(userId, dutyRepository, userInfoRepository);
    console.log("Duty found or created:", duty);

    if (duty.isActive) {
      return res.status(400).json({ message: "Duty is already active for this user." });
    }

    // Activate duty
    duty.isActive = true;
    duty.lastDutyOn = new Date();
    await dutyRepository.save(duty);

    // Start the timer for auto-ending the duty
    await startDutyTimer(userId, AUTO_END_DURATION_MS);

    return res.status(200).json({ message: "Duty started", duty });
  } catch (error) {
    console.error("Error starting duty:", error);
    return res.status(500).json({ message: "Error starting duty", error });
  }
};