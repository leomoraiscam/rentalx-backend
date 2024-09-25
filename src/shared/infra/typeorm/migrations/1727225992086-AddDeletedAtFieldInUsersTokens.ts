import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedAtFieldInUsersTokens1727225992086
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users_tokens',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users_tokens', 'deleted_at');
  }
}
