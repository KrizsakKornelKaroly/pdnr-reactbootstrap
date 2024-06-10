import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { UserInfo } from "./UserInfo.entity"

@Entity({ name: 'duty' })
export class Duty {
    @PrimaryGeneratedColumn()
    duty_id: number

    @Column()
    isActive: boolean

    @Column()
    sumTime: number

    @Column()
    lastDutyOn: Date

    @Column()
    lastDutyOff: Date

    @Column()
    lastDutySum: number

    @ManyToOne(() => UserInfo, (userInfo) => userInfo.duties)
    userInfo: UserInfo
}