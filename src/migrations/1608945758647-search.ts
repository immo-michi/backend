import { MigrationInterface, QueryRunner } from "typeorm"

export class search1608945758647 implements MigrationInterface {
    name = 'search1608945758647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9820ea1b6673f8da15873a5a86" ON "property" ("deleted") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_9820ea1b6673f8da15873a5a86"`);
    }

}
