import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Restaurant from './Restaurant';
import ImagesProduct from './ImagesProduct';

@Entity('products')
export default class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @Column()
  offer: boolean;

  @Column()
  offer_description: string;

  @Column()
  offer_price: number;

  @Column()
  offer_length: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.products, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'product_id'})
  restaurant: Restaurant[];

  @OneToMany(() => ImagesProduct, image => image.product, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'product_id'})
  images: ImagesProduct[];
}