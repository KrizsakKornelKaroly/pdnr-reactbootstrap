import { IsDate, IsEmail, Max, Min } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Duty } from "./Duty.entity";

export enum UserType {
    ADMIN = "admin",
    USER = "user",
    LEADER= "leader",
}

@Entity({ name: "userInfo" })
export class UserInfo {
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

    @Column({ type: "varchar"})
    password: string;

    @Column({ type: "enum", enum: UserType, default: UserType.USER })
    userLevel: UserType;

    @CreateDateColumn()
    joinDate: Date;

    @OneToMany(() => Duty, (duty) => duty.userInfo)
    duties: Duty[];
}
