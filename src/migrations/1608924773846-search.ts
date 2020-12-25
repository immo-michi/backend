import { MigrationInterface, QueryRunner } from "typeorm"

export class search1608924773846 implements MigrationInterface {
    name = 'search1608924773846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_4a782d3b3733eaedebc40e6780" ON "property" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_fb48a701ea1ec50abb84a81a74" ON "property" ("area") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2e40b8c813c06fa5522526b06" ON "property" ("lat", "lng") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e3cb65a94eec18df69e1ac462c" ON "property" ("source", "sourceId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e3cb65a94eec18df69e1ac462c"`);
        await queryRunner.query(`DROP INDEX "IDX_a2e40b8c813c06fa5522526b06"`);
        await queryRunner.query(`DROP INDEX "IDX_fb48a701ea1ec50abb84a81a74"`);
        await queryRunner.query(`DROP INDEX "IDX_4a782d3b3733eaedebc40e6780"`);
    }

}
