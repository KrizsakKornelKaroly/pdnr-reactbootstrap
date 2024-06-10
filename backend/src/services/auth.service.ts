import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";
import { RegisterUserData } from "../types/types";

interface IcName {
  ic_name: string;
}

const UserInfoRepository = AppDataSource.getRepository(UserInfo);

export class AuthService {
  static async registerUser(data: RegisterUserData): Promise<IcName> {
    const user = new UserInfo();

    return {
      ic_name: data.ic_name,
    };
  }
}
