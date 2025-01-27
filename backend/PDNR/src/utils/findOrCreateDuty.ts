import { AppDataSource } from "../data-source";
import { Duty } from "../entity/Duty.entity";
import { UserInfo } from "../entity/UserInfo.entity";

export async function findOrCreateDuty(
  userId: number,
  dutyRepository: ReturnType<typeof AppDataSource.getRepository<Duty>>,
  userInfoRepository: ReturnType<typeof AppDataSource.getRepository<UserInfo>>
): Promise<Duty> {
  // Try to find an existing duty (active or inactive)
  let duty = await dutyRepository.findOne({
    where: { userInfo: { user_id: userId } },
    relations: ["userInfo"],
  });

  if (!duty) {
    // Create a new duty if none exists
    const userInfo = await userInfoRepository.findOneOrFail({ where: { user_id: userId } });
    duty = dutyRepository.create({
      userInfo,
      isActive: false,
      lastDutyOn: new Date(),
    });
  }

  return duty;
}