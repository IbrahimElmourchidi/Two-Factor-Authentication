import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  multiFactor: boolean;

  @Column({
    nullable: true,
  })
  secret: string;
}
