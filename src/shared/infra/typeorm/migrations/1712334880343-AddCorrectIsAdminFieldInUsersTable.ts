import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCorrectIsAdminFieldInUsersTable1712334880343
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_admin',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_admin');
  }
}
