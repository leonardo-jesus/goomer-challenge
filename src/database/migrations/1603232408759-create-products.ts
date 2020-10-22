import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createProducts1603232408759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            scale: 10,
            precision: 2,
          },
          {
            name: 'category',
            type: 'text',
          },
          {
            name: 'offer',
            type: 'boolean',
          },
          {
            name: 'offer_description',
            type: 'text',
          },
          {
            name: 'offer_price',
            type: 'decimal',
            scale: 10,
            precision: 2,
          },
          {
            name: 'offer_length',
            type: 'text',
          },
        ],
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('products');
    }

}
