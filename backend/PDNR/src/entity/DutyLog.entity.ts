import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Duty } from "./Duty.entity";
import { UserInfo } from "./UserInfo.entity";

@Entity({ name: "duty_log" })
export class DutyLog {
    @PrimaryGeneratedColumn()
    log_id!: number;

    @ManyToOne(() => Duty, (duty) => duty.dutyLogs)
    @JoinColumn({ name: 'dutyId' })
    duty!: Duty;

    @ManyToOne(() => UserInfo, (userInfo) => userInfo.dutyLogs)
    @JoinColumn({ name: 'userInfoId' })
    userInfo!: UserInfo;

    @Column({ type: "timestamp" })
    dutyOn!: Date;

    @Column({ type: "timestamp", nullable: true })
    dutyOff!: Date | null;

    @Column({ type: "int", default: 0 })
    durationInSeconds!: number;
}
