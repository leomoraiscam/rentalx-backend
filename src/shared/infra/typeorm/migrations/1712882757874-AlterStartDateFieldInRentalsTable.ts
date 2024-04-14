import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterStartDateFieldInRentalsTable1712882757874
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'rentals',
      'start_date',
      new TableColumn({
        name: 'start_date',
        type: 'timestamp',
        default: 'now()',
      })
    );
  }
}
