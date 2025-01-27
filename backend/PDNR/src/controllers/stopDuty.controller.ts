import { Request, Response } from "express";
import { stopDuty } from "../services/duty.service";

export const stopDutyController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.session.user_id as number;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in session" });
        }

        const result = await stopDuty(userId);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({
            message: "Duty stopped successfully",
            totalDutyTime: result.totalDutyTime,
            lastDutyDuration: result.lastDutyDuration
        });

    } catch (error) {
        console.error("Error stopping duty:", error);
        return res.status(500).json({ message: "Error stopping duty", error });
    }
};