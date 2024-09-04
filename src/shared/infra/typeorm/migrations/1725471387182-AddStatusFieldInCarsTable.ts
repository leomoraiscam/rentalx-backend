import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusFieldInCarsTable1725471387182
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enumName: 'CarStatusEnum',
        enum: [
          'AVAILABLE',
          'RENTED',
          'UNDER_MAINTENANCE',
          'RESERVED',
          'OUT_OF_SERVICE',
        ],
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cars', 'status');
  }
}
