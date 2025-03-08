import {MigrationInterface, QueryRunner} from "typeorm";

export class rental1741473348903 implements MigrationInterface {
    name = 'rental1741473348903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "rental" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "rental"`);
    }

}
