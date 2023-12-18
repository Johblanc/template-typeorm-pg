import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn, Unique } from "typeorm";


@Entity("images")
@Unique(['dir','file'])
export class Image extends BaseEntity {

  /** Nom de l'image */
  @ApiProperty()
  @PrimaryColumn({name : 'file'})
  file: string;

  /** Dossier de l'image */
  @ApiProperty()
  @PrimaryColumn({name : 'dir'})
  dir: string;

  /** Texte alternatif de l'image */
  @ApiProperty()
  @Column({nullable : true})
  alt: string;

  /** Liaison éventuelle à la Table User */
  @ApiProperty()
  @OneToOne(() => User, (user) => user.image, { nullable : true})
  user : User ;

  /** Adresse complete de l'image */
  @ApiProperty()
  @Expose()
  get path () {
    return `${this.dir}/${this.file}`
  }
}
