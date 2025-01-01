import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { UserInfo } from "./UserInfo.entity";
import { DutyLog } from "./DutyLog.entity";

@Entity({ name: "duty" })
export class Duty {
    @PrimaryGeneratedColumn()
    duty_id!: number;

    @Column({ default: false })
    isActive!: boolean;

    @Column({ type: "int", default: 0 })
    totalDutyTime!: number;

    @Column({ type: "timestamp", nullable: true })
    lastDutyOn!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    lastDutyOff!: Date | null;

    @Column({ type: "int", default: 0 })
    lastDutyDuration!: number;

    @ManyToOne(() => UserInfo, (userInfo) => userInfo.duties)
    userInfo!: UserInfo;

    @OneToMany(() => DutyLog, (dutyLog) => dutyLog.duty)
    dutyLogs!: DutyLog[];
}
