import { MigrationInterface, QueryRunner } from "typeorm"

export class values1608417001202 implements MigrationInterface {
    name = 'values1608417001202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "values" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "values"`);
    }

}
