import { MigrationInterface, QueryRunner } from "typeorm"

export class favorites1609680391016 implements MigrationInterface {
    name = 'favorites1609680391016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "avatar" character varying NOT NULL, "email" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "ownerId" integer, CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e7d115ba85897bd786c30fb9b9" ON "favorite_list" ("deleted") `);
        await queryRunner.query(`CREATE TABLE "favorite" ("id" SERIAL NOT NULL, "note" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "listId" integer, "propertyId" integer, "createdById" integer, CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea8bde853b0933751c31306524" ON "favorite" ("deleted") `);
        await queryRunner.query(`ALTER TABLE "favorite_list" ADD CONSTRAINT "FK_55e936e48c354139ccfb6636963" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_8dd561ff2c5584231859ec9af22" FOREIGN KEY ("listId") REFERENCES "favorite_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_ccdc459572d1ae97dea4281fb3b" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_7c0b853c9ed3d098933ab4892f1" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_7c0b853c9ed3d098933ab4892f1"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_ccdc459572d1ae97dea4281fb3b"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_8dd561ff2c5584231859ec9af22"`);
        await queryRunner.query(`ALTER TABLE "favorite_list" DROP CONSTRAINT "FK_55e936e48c354139ccfb6636963"`);
        await queryRunner.query(`DROP INDEX "IDX_ea8bde853b0933751c31306524"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP INDEX "IDX_e7d115ba85897bd786c30fb9b9"`);
        await queryRunner.query(`DROP TABLE "favorite_list"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
