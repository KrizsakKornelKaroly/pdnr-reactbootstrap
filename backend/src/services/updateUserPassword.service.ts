import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";
import { validatePassword } from "./password.services";

export const updateUserPassword = async (
  userId: number,
  newPassword: string
): Promise<void> => {
  const userRepository = AppDataSource.getRepository(UserInfo);
  const user = await userRepository.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;

  await userRepository.save(user);
};
