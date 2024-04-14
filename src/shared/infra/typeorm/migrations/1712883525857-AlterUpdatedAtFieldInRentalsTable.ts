import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUpdatedAtFieldInRentalsTable1712883525857
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      'updated_at',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      'updated_at',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      })
    );
  }
}
