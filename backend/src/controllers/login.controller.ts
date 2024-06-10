import { Request, Response } from "express";
import { comparePassword } from "../services/password.services"
import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const userRepository = AppDataSource.getRepository(UserInfo);
        const user = await userRepository.findOne({ where: { email } });


        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect password." });
        }
        
        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        console.error("Error occurred while logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
