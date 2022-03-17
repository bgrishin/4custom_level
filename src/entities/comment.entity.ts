import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  author: number;

  @Column()
  post: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;
}
