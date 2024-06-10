import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";

export const validateUserCredentials = async (ic_name: string, steam_name: string, dc_name: string, email: string): Promise<void> => {
  if (!ic_name || !steam_name || !dc_name || !email) {
    throw new Error("Missing required user credentials: ic_name, steam_name, dc_name, or email");
  }

  try {
    const userRepository = AppDataSource.getRepository(UserInfo);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.error('A user with the provided email already exists');
      throw new Error('A user with the provided email already exists');
    }

    const existingUserByName = await userRepository.findOne({ where: { ic_name, dc_name } });
    if (existingUserByName) {
      console.error('A user with the provided ic_name and dc_name combination already exists');
      throw new Error('A user with the provided ic_name and dc_name combination already exists');
    }

  } catch (error) {
    console.error('Internal server error during user credentials validation');
    throw new Error('Internal server error during user credentials validation');
  }
};
