import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddResetPasswordFieldsToUser1748324040844 implements MigrationInterface {
    name = 'AddResetPasswordFieldsToUser1748324040844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("users", [
            new TableColumn({
                name: "resetPasswordToken",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "resetPasswordExpires",
                type: "timestamp",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("users", ["resetPasswordToken", "resetPasswordExpires"]);
    }
}