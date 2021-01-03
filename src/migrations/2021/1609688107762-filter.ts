import { MigrationInterface, QueryRunner } from "typeorm"

export class filter1609688107762 implements MigrationInterface {
    name = 'filter1609688107762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification" DROP COLUMN "lat1"`);
        await queryRunner.query(`ALTER TABLE "user_notification" DROP COLUMN "lng1"`);
        await queryRunner.query(`ALTER TABLE "user_notification" DROP COLUMN "lat2"`);
        await queryRunner.query(`ALTER TABLE "user_notification" DROP COLUMN "lng2"`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD "filter" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification" DROP COLUMN "filter"`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD "lng2" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD "lat2" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD "lng1" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD "lat1" numeric NOT NULL`);
    }

}
