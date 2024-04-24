import { IsDate, IsEmail, Max, Min } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

enum UserType {
    ADMIN = "admin",
    USER = "user"
}

@Entity({ name: "userInfo" })
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: "varchar", length: 50 })
    ic_name: string;

    @Column({ type: "varchar", length: 50 })
    steam_name: string;

    @Column({ type: "varchar", length: 30 })
    dc_name: string;

    @Column({ type: "varchar", length: 45 })
    @IsEmail()
    email: string;

    @Column({ type: "varchar", length: 45 })
    @Min(8)
    @Max(45)
    password: string;

    @Column({ type: "enum", enum: UserType, default: UserType.USER })
    userLevel: UserType;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    @IsDate()
    joinDate: Date;
}
