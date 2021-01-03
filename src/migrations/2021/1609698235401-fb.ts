import { MigrationInterface, QueryRunner } from "typeorm"

export class fb1609698235401 implements MigrationInterface {
    name = 'fb1609698235401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "facebookId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebookId"`);
    }

}
