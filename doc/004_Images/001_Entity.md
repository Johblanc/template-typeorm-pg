# Entité Image

## Class Image

Créer un fichier ```src/images/entity/image.entity.ts``` :

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn, Unique } from "typeorm";

@Entity("images")
@Unique(['dir','file'])
export class Image extends BaseEntity {

  @ApiProperty()
  @PrimaryColumn({name : 'file'})
  file: string;

  @ApiProperty()
  @PrimaryColumn({name : 'dir'})
  dir: string;

  @ApiProperty()
  @Column({nullable : true})
  alt: string;

  @ApiProperty()
  @OneToOne(() => User, (user) => user.image, { nullable : true})
  user : User ;

  @ApiProperty()
  @Expose()
  get path () {
    return `${this.dir}/${this.file}`
  }
}
```
ATTENTION : Le code renvoie des erreurs pour le moment, c'est du au fait que l'Entité User n'a pas encore de propriété ```image```. Voir étape suivante.


* ```@Unique(['dir','file'])``` indique que la combinaison (dir + file) doit être unique.
* Les propriétés : 
  * ```file``` : nom de l'image
  * ```dir```  : dossier de l'image
  * ```alt```  : texte alternatif de l'image
* La relation ```@OneToOne()``` :
  * ```user``` : l'utilisateur à qui appartient la photo
* La colonne calculée ```@Expose()``` :
  * ```path``` : l'adresse complète de l'image

## Relation bidirectionnel

Pour le moment l'Entité User n'est pas lié à Image. Dans ```src/users/entity/user.entity.ts``` ajouter la propriété ```image```:

```ts
/* ... */
import { Image } from "src/images/entities/image.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

/* ... */
export class User extends BaseEntity {
  /* ... */
  @ApiProperty()
  @OneToOne(() => Image, (image) => image.user, { nullable : true, eager : true})
  @JoinColumn()
  image : Image ;
}
```

```@JoinColumn()``` indique que la/les clé(s) etrangère(s) de la relation ```One To One``` se trouve dans cette table

## Déclaration

Dans le fichier ```src/app.module```, ajouter ```Image``` aux entities importées :

```ts
/* ... */
import { Image } from './images/entities/image.entity';

@Module({
  /* ... */
  imports: [
    /* ... */
    TypeOrmModule.forRoot({
      /* ... */
      entities: [
        /* ... */
        Image,
      ],
      /* ... */
    }),
    /* ... */
  ],
})
export class AppModule {}
```