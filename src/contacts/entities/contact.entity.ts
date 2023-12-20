import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact')
export class Contact extends BaseEntity {
  
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Status du contact a
   *
   * * 0 en attente
   * * 1 demandé
   * * 2 bloqué
   */
  @ApiProperty()
  @Column({ default: 1 })
  status_a: number;

  /** Status du contact b */
  @ApiProperty()
  @Column({ default: 0 })
  status_b: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.contacts_a)
  user_a: User;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.contacts_b)
  user_b: User;

  view_as_a (claimant?: User | "self" | "admin" | "user"){
    return {
      status : `${this.status_a}${this.status_b}`,
      user : this.user_b.view(claimant)
    }
  }

  view_as_b (claimant?: User | "self" | "admin" | "user"){
    return {
      status : `${this.status_b}${this.status_a}`,
      user : this.user_a.view(claimant)
    }
  }
}
