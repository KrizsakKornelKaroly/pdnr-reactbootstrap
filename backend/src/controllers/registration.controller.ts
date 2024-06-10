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
  const { ic_name, steam_name, dc_name, email, password, otpCode }: RegisterUserData =
    req.body;
  const userCreds = { ic_name, steam_name, dc_name, email, password, otpCode };

  try {
    await validateUserCredentials( 
      userCreds.ic_name,
      userCreds.steam_name,
      userCreds.dc_name,
      userCreds.email,
    );
    await validateOtpCode(userCreds.otpCode, res);
    const hashedPassword = await encryptPassword(password);
    await comparePassword(password, hashedPassword);
    await saveUserRegistration(userCreds.ic_name, userCreds.steam_name, userCreds.dc_name, userCreds.email, hashedPassword);
    console.log("Credentials are valid. Registration process can continue.");
    console.log("All validation functions were passed.");

    
    res.status(200).send("Registration successful");
  } catch (error) {
   return res
      .status(400)
      .send("Registration validation failed: " + error.message);
      
  }
};
