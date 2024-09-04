import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterStatusFieldInRentalsTable1725472179388
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('rentals', 'status');

    await queryRunner.addColumn(
      'rentals',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enumName: 'RentalStatusEnum',
        enum: ['CONFIRMED', 'PICKED_UP', 'CANCELLED', 'OVERDUE', 'CLOSED'],
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('rentals', 'status');

    await queryRunner.addColumn(
      'rentals',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enumName: 'StatusEnum',
        enum: ['pending', 'confirmed', 'canceled'],
        isNullable: true,
      })
    );
  }
}
