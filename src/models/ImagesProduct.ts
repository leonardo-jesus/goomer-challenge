import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Product from './Product';

@Entity('imagesProduct')
export default class ImagesProduct {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Product, product => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}