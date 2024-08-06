import { Request, Response } from "express";
import { comparePassword } from "../services/password.services";
import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";

declare module 'express-session' {
    export interface SessionData {
        user_id: number;
        userLevel: string;
        ic_name: string;
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "E-mail cím és jelszó megadása kötelező." });
        }

        const userRepository = AppDataSource.getRepository(UserInfo);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Hibás E-mail vagy jelszó." });
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Hibás E-mail vagy jelszó." });
        }

        req.session.user_id = user.user_id;
        req.session.userLevel = user.userLevel;
        req.session.ic_name = user.ic_name; // Optional: store userLevel
        console.log(req.session);

        // Respond with JSON indicating successful login
        res.status(200).json({ message: "Sikeres bejelentkezés", user });

    } catch (error) {
        console.error("Error occurred while logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
