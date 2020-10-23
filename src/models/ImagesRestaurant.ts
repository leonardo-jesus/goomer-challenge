import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Restaurant from './Restaurant';

@Entity('imagesRestaurant')
export default class ImagesRestaurant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.imagesRestaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}