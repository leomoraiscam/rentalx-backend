import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusFieldInRentalTable1713120894065
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('rentals', 'status');
  }
}
