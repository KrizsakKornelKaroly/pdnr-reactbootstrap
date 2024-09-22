import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { UserInfo } from "./UserInfo.entity";
import { DutyLog } from "./DutyLog.entity";

@Entity({ name: "duty" })
export class Duty {
    @PrimaryGeneratedColumn()
    duty_id: number;

    @Column({ default: false })
    isActive: boolean;  // Whether the user is currently on duty

    @Column({ type: "int", default: 0 })
    totalDutyTime: number;  // Total time the user has worked (in seconds)

    @Column({ type: "timestamp", nullable: true })
    lastDutyOn: Date;  // Last time the duty started

    @Column({ type: "timestamp", nullable: true })
    lastDutyOff: Date;  // Last time the duty ended

    @Column({ type: "int", default: 0 })
    lastDutyDuration: number;  // Duration of the last duty session (in seconds)

    // Relation to the UserInfo entity (a user can have multiple duties)
    @ManyToOne(() => UserInfo, (userInfo) => userInfo.duties)
    userInfo: UserInfo;

    // Relation to the DutyLog entity (a duty can have multiple duty logs)
    @OneToMany(() => DutyLog, (dutyLog) => dutyLog.duty)
    dutyLogs: DutyLog[];
}
