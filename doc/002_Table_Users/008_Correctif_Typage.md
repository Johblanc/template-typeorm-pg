# Correctif Typage

## User entity

Dans le fichier ```src/users/entities/user.entity.ts``` :

```ts
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
}
```


## Users Services

Dans le fichier ```src/users/users.services.ts``` :

```ts
async update(id: string, dto: Partial<User>): Promise<User | null> {
  const user = await User.findOneBy({ id });
  if (user) {
    if (dto.pseudo!== undefined) user.pseudo = dto.pseudo;
    if (dto.password!== undefined) user.password = dto.password;
    if (dto.mail!== undefined) user.mail = dto.mail;
    if (dto.first_name!== undefined) user.first_name = dto.first_name;
    if (dto.last_name!== undefined) user.last_name = dto.last_name;
    await user.save();
  }
  return user;
}
```