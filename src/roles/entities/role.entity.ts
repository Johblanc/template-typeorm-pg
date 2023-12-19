import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Entity, BaseEntity, Column, PrimaryColumn, ManyToMany } from "typeorm";

/** Role dans l'application */
@Entity("roles")
export class Role extends BaseEntity {

  /** Nom du role */
  @ApiProperty()
  @PrimaryColumn({name : 'name'})
  name: string;

  /** Niveau d'acces */
  @ApiProperty()
  @Column()
  acces_level: number;

  /** Utilisateurs ayant ce role */
  @ApiProperty()
  @ManyToMany(() => User, (user) => user.sub_roles )
  users : User[];
}