import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTypeFieldInCategoryTable1714350944911
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('categories', 'type');
  }
}
