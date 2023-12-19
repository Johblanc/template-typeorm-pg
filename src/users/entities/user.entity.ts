import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Image } from "src/images/entities/image.entity";
import { Role } from "src/roles/entities/role.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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
  @Column({type: "character varying" , nullable: true})
  first_name : string | null;

  /** Nom de l'Utilisateur */
  @ApiProperty()
  @Column({type:"character varying" , nullable: true})
  last_name : string | null ;
  
  /** Mail de l'Utilisateur */
  @ApiProperty()
  @Column({type:"character varying" ,nullable: true, select : false})
  mail : string | null ;
  
  /** Date de création de l'utilisateur */
  @ApiProperty()
  @CreateDateColumn({type:"timestamptz"})
  creat_at : string ;

  /** Date de dernière activité de l'utilisateur */
  @ApiProperty()
  @Column({type:"timestamptz"})
  actif_at : string ;

  /** Avatar de l'utilisateur */
  @ApiProperty()
  @OneToOne(() => Image, (image) => image.user, { nullable : true, eager : true})
  @JoinColumn()
  image : Image | null ;

  /** Roles de l'utilisateur */
  @ApiProperty()
  @ManyToMany(() => Role, (role) => role.users , {eager : true})
  @JoinTable()
  sub_roles : Role[];

  @ApiProperty()
  @Expose()
  get role (){
    let acces_level = 0;
    if (this.sub_roles.length > 0){
      this.sub_roles.forEach( item => {
        acces_level = Math.max(acces_level, item.acces_level);
      })
    }
    return {
      acces_level,
    }
  }
}
