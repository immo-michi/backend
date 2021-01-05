import { MigrationInterface, QueryRunner } from "typeorm"

export class type1609846205942 implements MigrationInterface {
    name = 'type1609846205942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "type"`);
    }

}
