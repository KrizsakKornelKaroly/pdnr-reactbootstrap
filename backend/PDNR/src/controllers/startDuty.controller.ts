import { Request, Response } from "express";
import { startDuty } from "../services/duty.service";

export const startDutyController = async (req: Request, res: Response): Promise<Response> => {
  try {
      const userId = req.session.user_id as number;
      if (!userId) {
          return res.status(400).json({ message: "User ID not found in session" });
      }

      const result = await startDuty(userId);
      
      if (!result.success) {
          return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ 
          message: "Duty started successfully", 
          duty: result.duty 
      });

  } catch (error) {
      console.error("Error starting duty:", error);
      return res.status(500).json({ message: "Error starting duty", error });
  }
};