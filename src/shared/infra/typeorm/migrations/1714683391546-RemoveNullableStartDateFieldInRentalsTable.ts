import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveNullableStartDateFieldInRentalsTable1714683391546
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      'start_date',
      new TableColumn({
        name: 'start_date',
        type: 'timestamp',
        isNullable: false,
        default: 'now()',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      'start_date',
      new TableColumn({
        name: 'start_date',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }
}
