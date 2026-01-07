import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTypeFieldInUsersTokens1767793810796
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users_tokens',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        enum: ['REFRESH_TOKEN', 'RESET_PASSWORD'],
        enumName: 'TokenTypeEnum',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users_tokens', 'type');
    await queryRunner.query('DROP TYPE "TokenTypeEnum"');
  }
}
