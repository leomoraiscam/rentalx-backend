import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveIsAdminFieldInUsersTable1712334733626
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'isAdmin');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isAdmin',
        type: 'boolean',
        default: false,
      })
    );
  }
}
