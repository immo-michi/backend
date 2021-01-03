import { MigrationInterface, QueryRunner } from "typeorm"

export class notification1609681238090 implements MigrationInterface {
    name = 'notification1609681238090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notification" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "lat1" numeric NOT NULL, "lng1" numeric NOT NULL, "lat2" numeric NOT NULL, "lng2" numeric NOT NULL, "userId" integer, CONSTRAINT "PK_8840aac86dec5f669c541ce67d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD CONSTRAINT "FK_dce2a8927967051c447ae10bc8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification" DROP CONSTRAINT "FK_dce2a8927967051c447ae10bc8b"`);
        await queryRunner.query(`DROP TABLE "user_notification"`);
    }

}
