import { AppDataSource } from "../data-source";
import { OTP_Code } from "../entity/OTP_Code.entity";
import { Response } from "express";

export const validateOtpCode = async (
  otpCode: number,
  res: Response
): Promise<void> => {
  try {
    const otpRepository = AppDataSource.getRepository(OTP_Code);
    const otpRecord = await otpRepository
      .createQueryBuilder("otp_code")
      .where("otp_code.code = :code", { code: otpCode.toString() })
      .andWhere("otp_code.isActive = true")
      .cache(true)
      .getOne();

    if (otpRecord !== null && otpRecord.isActive) {
      otpRecord.isActive = false;
      await AppDataSource.manager.save(otpRecord);
    } else {
      throw new Error("Invalid or inactive OTP code");
    }
  } catch (error) {
    throw new Error("Error validating OTP code");
  }
};
