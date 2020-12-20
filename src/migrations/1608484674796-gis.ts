import { MigrationInterface, QueryRunner } from "typeorm"

export class gis1608484674796 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('create extension if not exists cube')
        await queryRunner.query('create extension if not exists earthdistance')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
