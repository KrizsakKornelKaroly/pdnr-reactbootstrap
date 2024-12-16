import { AppDataSource } from "../data-source";
import { OTP_Code } from "../entity/OtpCodes.entity";
import { Response } from "express";

export const validateOtpCode = async (
  otpCode: number,
  res: Response
): Promise<void> => {
  try {
    const otpRepository = AppDataSource.getRepository(OTP_Code);
    const otpRecord = await otpRepository
      .createQueryBuilder("otpCodes")
      .where("otpCodes.code = :code", { code: otpCode.toString() })
      .andWhere("otpCodes.isActive = true")
      .cache(true)
      .getOne();

    if (otpRecord !== null && otpRecord.isActive) {
      otpRecord.isActive = false;
      await AppDataSource.manager.save(otpRecord);
    } else {
      throw new Error("Hibás vagy inaktív OTP kód");
    }
  } catch (error) {
    throw new Error("Hibatörtént a(z) OTP kód hitelesítése során");
  }
};
