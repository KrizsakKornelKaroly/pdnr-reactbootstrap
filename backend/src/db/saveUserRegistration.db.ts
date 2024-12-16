import { AppDataSource } from "../data-source";
import { UserInfo, UserType } from "../entity/UserInfo.entity";

export const saveUserRegistration = async (
    ic_name: string,
    steam_name: string,
    dc_name: string,
    email: string,
    password: string
): Promise<any> => {
    try {
        const userInfoRepository = AppDataSource.getRepository(UserInfo);
        
        const createUser = new UserInfo();
        createUser.ic_name = ic_name;
        createUser.steam_name = steam_name;
        createUser.dc_name = dc_name;
        createUser.email = email;
        createUser.password = password;
        createUser.userLevel = UserType.USER; // userLevel with default value
        createUser.joinDate = new Date(); // joinDate with default value

        const savedUser = await userInfoRepository.save(createUser);
        console.log("Registration successful. Generated user ID:", savedUser.user_id);
    } catch (error) {
        console.error("Error occurred while saving user registration:", error);
        throw error;
    }
};