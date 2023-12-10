import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


/**
 * Utilisateur de l'Api
 */
@Entity("users")
export class User extends BaseEntity {

  /** Identifiant de l'Utilisateur */
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id : string ;

  /** Pseudonime de l'Utilisateur */
  @ApiProperty()
  @Column({ unique : true})
  pseudo : string ;

  /** Le mot de passe de l'Utilisateur */
  @Exclude()
  @ApiProperty()
  @Column()
  password : string ;

  /** Prénom de l'Utilisateur */
  @ApiProperty()
  @Column({nullable: true})
  first_name : string ;

  /** Nom de l'Utilisateur */
  @ApiProperty()
  @Column({nullable: true})
  last_name : string ;
  
  /** Mail de l'Utilisateur */
  @ApiProperty()
  @Column({ nullable: true, select : false})
  mail : string ;
  
  /** Date de création de l'utilisateur */
  @ApiProperty()
  @CreateDateColumn({type:"timestamptz"})
  creat_at : string ;


  /** Date de dernière activité de l'utilisateur */
  @ApiProperty()
  @Column({type:"timestamptz"})
  actif_at : string ;


}
