import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveAvailableFieldInCarsTable1715208069483
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cars', 'available');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'available',
        type: 'boolean',
        isNullable: true,
      })
    );
  }
}
