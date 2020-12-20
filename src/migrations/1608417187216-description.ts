import { MigrationInterface, QueryRunner } from "typeorm"

export class description1608417187216 implements MigrationInterface {
    name = 'description1608417187216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "property"."description" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "property"."description" IS NULL`);
        await queryRunner.query(`ALTER TABLE "property" ALTER COLUMN "description" SET NOT NULL`);
    }

}
