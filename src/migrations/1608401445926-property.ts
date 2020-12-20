import { MigrationInterface, QueryRunner } from "typeorm"

export class property1608401445926 implements MigrationInterface {
    name = 'property1608401445926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "property" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "address" character varying NOT NULL, "lat" numeric NOT NULL, "lng" numeric NOT NULL, "price" numeric NOT NULL, "area" numeric NOT NULL, "link" character varying NOT NULL, "images" json NOT NULL, "tags" json NOT NULL, "source" character varying NOT NULL, "sourceId" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "contactCompany" character varying, "contactName" character varying, "contactPhone" character varying, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "property"`);
    }

}
