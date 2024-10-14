import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";

export const validateUserCredentials = async (ic_name: string, steam_name: string, dc_name: string, email: string): Promise<void> => {
  if (!ic_name || !steam_name || !dc_name || !email) {
    throw new Error("Hiányzó kötelező felhasználói adatok: ic_name, steam_name, dc_name vagy email");
  }

  try {
    const userRepository = AppDataSource.getRepository(UserInfo);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.error('Már létezik felhasználó a megadott email címmel');
      throw new Error('Már létezik felhasználó a megadott email címmel');
    }

    const existingUserByName = await userRepository.findOne({ where: { ic_name, dc_name } });
    if (existingUserByName) {
      console.error('Már létezik felhasználó a megadott ic_name és dc_name kombinációval');
      throw new Error('Már létezik felhasználó a megadott ic_name és dc_name kombinációval');
    }

  } catch (error) {
    console.error('Belső szerverhiba történt a felhasználói adatok ellenőrzése során');
    throw new Error('Belső szerverhiba történt a felhasználói adatok ellenőrzése során');
  }
};
