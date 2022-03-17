import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  ip: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @Column()
  gender: string;

  @Column()
  birthdate: string;
}
