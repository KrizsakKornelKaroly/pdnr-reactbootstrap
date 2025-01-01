import { RegisterUserData } from "../types/types";
import { Request, Response } from "express";
import {
  comparePassword,
  encryptPassword,
} from "../services/password.services";
import { validateOtpCode } from "../services/validateOtpCode.service";
import { validateUserCredentials } from "../services/validateUserCredentials.service";
import { saveUserRegistration } from "../db/saveUserRegistration.db";

export const registrationController = async (req: Request, res: Response) => {
  const { ic_name, steam_name, dc_name, email, password, otpCode }: RegisterUserData = req.body;
  const userCreds = { ic_name, steam_name, dc_name, email, password, otpCode };

  try {
    await validateUserCredentials(
      userCreds.ic_name,
      userCreds.steam_name,
      userCreds.dc_name,
      userCreds.email,
    );
    const hashedPassword = await encryptPassword(password);
    await comparePassword(password, hashedPassword);
    await saveUserRegistration(userCreds.ic_name, userCreds.steam_name, userCreds.dc_name, userCreds.email, hashedPassword);
    await validateOtpCode(userCreds.otpCode, res);
    console.log("Credentials are valid. Registration process can continue.");
    console.log("All validation functions were passed.");

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
