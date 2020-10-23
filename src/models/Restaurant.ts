import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import ImagesRestaurant from './ImagesRestaurant';
import Product from './Product';

@Entity('restaurants')
export default class Restaurant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  about: string;

  @Column()
  opening_hours: string;

  @OneToMany(() => ImagesRestaurant, image => image.restaurant, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'restaurant_id'})
  imagesRestaurant: ImagesRestaurant[];

  @OneToMany(() => Product, product => product.restaurant, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'restaurant_id'})
  products: Product[];
}