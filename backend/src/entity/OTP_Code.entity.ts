import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'otpCodes' })
export class OTP_Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  code: string;

  @Column()
  isActive: boolean;

 /*@Column()
  activitedBy: string;
 */
}
