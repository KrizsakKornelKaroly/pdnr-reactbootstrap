import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserInfo } from "./UserInfo.entity";
import { Duty } from "./Duty.entity";
@Entity({ name: "duty_log" })
export class DutyLog {
    @PrimaryGeneratedColumn()
    log_id!: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dutyOn!: Date;

    @Column({ type: "timestamp", nullable: true })
    dutyOff!: Date | null;

    @Column({ type: "int", nullable: true })
    durationInSeconds!: number | null;

    @ManyToOne(() => Duty, (duty) => duty.dutyLogs)
    duty!: Duty;

    @ManyToOne(() => UserInfo, (userInfo) => userInfo.dutyLogs)
    userInfo!: UserInfo;
}

