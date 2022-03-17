import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  head_name: string;

  @Column()
  text: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @Column()
  author: number;
}
