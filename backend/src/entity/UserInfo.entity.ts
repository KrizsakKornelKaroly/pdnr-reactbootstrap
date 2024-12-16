import { IsEmail } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Duty } from "./Duty.entity";
import { DutyLog } from "./DutyLog.entity";

export enum UserType {
    ADMIN = "admin",
    USER = "user",
    LEADER = "leader",
}@Entity({ name: "userInfo" })
export class UserInfo {
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column({ type: "varchar", length: 50 })
    ic_name: string;

    @Column({ type: "varchar", length: 50 })
    steam_name: string;

    @Column({ type: "varchar", length: 30 })
    dc_name: string;

    @Column({ type: "varchar", length: 45 })
    @IsEmail()  // Ensures that email is valid
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: "enum", enum: UserType, default: UserType.USER })
    userLevel: UserType;

    @CreateDateColumn()  // Automatically sets the join date to current date
    joinDate: Date;

    @OneToMany(() => Duty, (duty) => duty.userInfo)
    duties!: Duty[];

    @OneToMany(() => DutyLog, (dutyLog) => dutyLog.userInfo)
    dutyLogs!: DutyLog[];
}

