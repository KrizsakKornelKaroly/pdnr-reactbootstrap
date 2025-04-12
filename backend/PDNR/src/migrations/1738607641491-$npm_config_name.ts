import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1738607641491 implements MigrationInterface {
    name = ' $npmConfigName1738607641491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`otpCodes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(6) NOT NULL, \`isActive\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userInfo\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`ic_name\` varchar(50) NOT NULL, \`steam_name\` varchar(50) NOT NULL, \`dc_name\` varchar(30) NOT NULL, \`email\` varchar(45) NOT NULL, \`password\` varchar(255) NOT NULL, \`userLevel\` enum ('admin', 'user', 'leader') NOT NULL DEFAULT 'user', \`joinDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`duty\` (\`duty_id\` int NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NOT NULL DEFAULT 0, \`totalDutyTime\` int NOT NULL DEFAULT '0', \`lastDutyOn\` timestamp NULL, \`lastDutyOff\` timestamp NULL, \`lastDutyDuration\` int NOT NULL DEFAULT '0', \`userInfoId\` int NULL, PRIMARY KEY (\`duty_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`duty_log\` (\`log_id\` int NOT NULL AUTO_INCREMENT, \`dutyOn\` timestamp NOT NULL, \`dutyOff\` timestamp NULL, \`durationInSeconds\` int NOT NULL DEFAULT '0', \`dutyId\` int NULL, \`userInfoId\` int NULL, PRIMARY KEY (\`log_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`duty\` ADD CONSTRAINT \`FK_997742c1dbd61d1735ff066ddb7\` FOREIGN KEY (\`userInfoId\`) REFERENCES \`userInfo\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`duty_log\` ADD CONSTRAINT \`FK_1e8414a10bdb445f759abe63ee3\` FOREIGN KEY (\`dutyId\`) REFERENCES \`duty\`(\`duty_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`duty_log\` ADD CONSTRAINT \`FK_cd30c080454dcc394c3be09ed61\` FOREIGN KEY (\`userInfoId\`) REFERENCES \`userInfo\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE \`query-result-cache\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NULL, \`time\` bigint NOT NULL, \`duration\` int NOT NULL, \`query\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`query-result-cache\``);
        await queryRunner.query(`ALTER TABLE \`duty_log\` DROP FOREIGN KEY \`FK_cd30c080454dcc394c3be09ed61\``);
        await queryRunner.query(`ALTER TABLE \`duty_log\` DROP FOREIGN KEY \`FK_1e8414a10bdb445f759abe63ee3\``);
        await queryRunner.query(`ALTER TABLE \`duty\` DROP FOREIGN KEY \`FK_997742c1dbd61d1735ff066ddb7\``);
        await queryRunner.query(`DROP TABLE \`duty_log\``);
        await queryRunner.query(`DROP TABLE \`duty\``);
        await queryRunner.query(`DROP TABLE \`userInfo\``);
        await queryRunner.query(`DROP TABLE \`otpCodes\``);
    }

}
