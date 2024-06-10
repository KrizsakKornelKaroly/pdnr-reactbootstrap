import { AppDataSource } from "../data-source";
import { UserInfo, UserType } from "../entity/UserInfo.entity";

export const saveUserRegistration = async(ic_name: string, steam_name: string, dc_name: string, email: string, hashedPassword: string): Promise<void> => {
  try {
    const userInfoRepository = AppDataSource.getRepository(UserInfo);

    const createUser = new UserInfo();
    createUser.ic_name = ic_name;
    createUser.steam_name  = steam_name;
    createUser.dc_name = dc_name;
    createUser.email = email;
    createUser.password = hashedPassword;
    createUser.userLevel = UserType.USER;
    createUser.joinDate = new Date();

    await userInfoRepository.save(createUser);
    console.log("User registration successful");
  } catch (error) {
    console.error("Error occurred while saving user registration:", error);
    throw error;
  }
};
